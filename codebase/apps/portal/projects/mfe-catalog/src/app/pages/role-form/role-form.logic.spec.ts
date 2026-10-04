import { describe, expect, it } from 'vitest';
import { RoleDetail } from '../../data-access/catalog.models';
import {
  FormCompetency,
  MESSAGES,
  RoleForm,
  describeSaveError,
  emptyForm,
  fromDetail,
  toBody,
  validate,
} from './role-form.logic';

const comp = (over: Partial<FormCompetency> = {}): FormCompetency => ({
  competencyId: 'c1',
  name: 'Git',
  versionId: 'v1',
  versionNumber: 1,
  requiredLevel: 'L1',
  isCurrent: true,
  suggestedVersionId: null,
  ...over,
});

const valid = (): RoleForm => ({
  name: 'Developer',
  description: '',
  levels: [{ name: 'Junior', ordinal: 1, status: 'ACTIVE', competencies: [comp()] }],
});

describe('validate', () => {
  it('un formulario completo no tiene errores', () => {
    expect(validate(valid())).toEqual({});
  });

  it('el formulario vacío exige nombre, nombre de nivel y una competencia', () => {
    const e = validate(emptyForm());
    expect(e['name']).toBe(MESSAGES.nameRequired);
    expect(e['level.0.name']).toBe(MESSAGES.levelNameRequired);
    expect(e['level.0.competencies']).toBe(MESSAGES.competenciesRequired);
  });

  it('exige al menos un nivel', () => {
    expect(validate({ ...valid(), levels: [] })['levels']).toBe(MESSAGES.levelsRequired);
  });

  it('el nombre solo con espacios cuenta como vacío y el largo se mide recortado', () => {
    expect(validate({ ...valid(), name: '   ' })['name']).toBe(MESSAGES.nameRequired);
    expect(validate({ ...valid(), name: ' ' + 'x'.repeat(120) + ' ' })['name']).toBeUndefined();
    expect(validate({ ...valid(), name: 'x'.repeat(121) })['name']).toBe(MESSAGES.nameTooLong);
  });

  it('dos niveles no pueden llamarse igual, sin distinguir mayúsculas', () => {
    const f = valid();
    f.levels.push({ name: ' JUNIOR ', ordinal: 2, status: 'ACTIVE', competencies: [comp()] });
    expect(validate(f)['level.1.name']).toBe(MESSAGES.levelNameDuplicated);
  });

  it('la misma competencia dos veces en un nivel se señala en la repetida', () => {
    const f = valid();
    f.levels[0].competencies.push(comp());
    expect(validate(f)['level.0.c.1']).toBe(MESSAGES.competencyDuplicated);
    expect(validate(f)['level.0.c.0']).toBeUndefined();
  });

  it('exige elegir la competencia y su nivel esperado', () => {
    const f = valid();
    f.levels[0].competencies = [comp({ competencyId: '' }), comp({ competencyId: 'c2', requiredLevel: '' })];
    const e = validate(f);
    expect(e['level.0.c.0']).toBe(MESSAGES.competencyRequired);
    expect(e['level.0.c.1']).toBe(MESSAGES.requiredLevelRequired);
  });
});

describe('toBody', () => {
  it('recorta los textos, manda la descripción vacía como null y omite el id de un nivel nuevo', () => {
    const f = valid();
    f.name = '  Developer ';
    f.levels[0].name = ' Junior ';
    expect(toBody(f)).toEqual({
      name: 'Developer',
      description: null,
      levels: [{ name: 'Junior', ordinal: 1, competencies: [{ competency_id: 'c1', version_id: 'v1', required_level: 'L1' }] }],
    });
  });

  it('conserva el id de un nivel existente', () => {
    const f = valid();
    f.levels[0].id = 'lv-1';
    expect(toBody(f).levels[0].id).toBe('lv-1');
  });
});

describe('fromDetail', () => {
  it('lleva el detalle de la API al formulario y de vuelta al mismo cuerpo', () => {
    const detail: RoleDetail = {
      id: 'r1',
      name: 'Developer',
      description: 'Backend',
      status: 'ACTIVE',
      row_version: 3,
      created_at: '2026-10-04T00:00:00Z',
      created_by: 'jefe',
      updated_at: null,
      updated_by: null,
      levels: [
        {
          id: 'lv-1',
          name: 'Junior',
          ordinal: 1,
          status: 'INACTIVE',
          usable: true,
          evidence_requirements: 2,
          competencies: [
            { competency_id: 'c1', name: 'Git', required_level: 'L2', version: { id: 'v1', version_number: 1, status: 'APPROVED' }, is_current: false, suggested_version_id: 'v2' },
          ],
        },
      ],
    };
    const form = fromDetail(detail);
    expect(form.levels[0]).toMatchObject({ id: 'lv-1', status: 'INACTIVE' });
    expect(form.levels[0].competencies[0]).toMatchObject({ isCurrent: false, suggestedVersionId: 'v2', versionNumber: 1 });
    expect(toBody(form)).toEqual({
      name: 'Developer',
      description: 'Backend',
      levels: [{ id: 'lv-1', name: 'Junior', ordinal: 1, competencies: [{ competency_id: 'c1', version_id: 'v1', required_level: 'L2' }] }],
    });
  });
});

describe('describeSaveError', () => {
  const body = (code: string, message = 'del servicio') => ({ error: { code, message } });

  it('412 es un conflicto: hay que recargar', () => {
    expect(describeSaveError(412, body('PRECONDITION_FAILED'))).toEqual({
      message: 'Otra persona modificó este rol. Recarga para ver los cambios.',
      conflict: true,
    });
  });

  it('nombre repetido y competencia repetida tienen mensaje propio', () => {
    expect(describeSaveError(409, body('ROLE_NAME_DUPLICATE')).message).toBe('Ya existe un rol con ese nombre.');
    expect(describeSaveError(409, body('COMPETENCY_DUPLICATED')).message).toBe(MESSAGES.competencyDuplicated);
  });

  it('un 422 por requisitos de evidencia explica cuál competencia', () => {
    const p = describeSaveError(422, body('EVIDENCE_REQUIREMENTS_MISSING', 'La competencia «Git» no tiene requisitos'));
    expect(p.message).toBe('La competencia «Git» no tiene requisitos');
    expect(p.conflict).toBe(false);
  });

  it('un fallo de red o del servidor conserva lo escrito y no es conflicto', () => {
    for (const status of [0, 500, 503]) {
      const p = describeSaveError(status, null);
      expect(p.conflict).toBe(false);
      expect(p.message).toContain('Tus cambios siguen aquí');
    }
  });

  it('un código desconocido usa el mensaje del servicio o uno genérico', () => {
    expect(describeSaveError(409, body('OTRO', 'texto'))).toEqual({ message: 'texto', conflict: false });
    expect(describeSaveError(400, null).message).toBe('No se pudo guardar el rol.');
  });
});
