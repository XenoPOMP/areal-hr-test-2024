import axios from 'axios';
import { useQuasar } from 'quasar';
import { departmentSchema } from 'src/pages/shemas/Departmant.shemas';

interface DepartmentInput {
  id?: number;
  deleted_at?: Date | null;
  name: string;
  comment?: string;
  parent_id?: number | null;
  organisation_id?: number | null;
}

export function useUpdateDepartment(loadDepartments: () => Promise<void>) {
  const $q = useQuasar();

  const updateDepartment = async (
    id: number,
    departmentData: DepartmentInput
  ) => {
    const sanitizedData = { ...departmentData };
    delete sanitizedData.id;
    delete sanitizedData.deleted_at;

    const { error } = departmentSchema.validate(sanitizedData, {
      abortEarly: false,
    });

    if (error) {
      error.details.forEach((err) =>
        $q.notify({ type: 'negative', message: err.message })
      );
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/departments/${id}`,
        sanitizedData,
        { withCredentials: true }
      );
      await loadDepartments(); // Теперь loadDepartments передается корректно
      $q.notify({ type: 'positive', message: 'Отдел успешно обновлен' });
    } catch (error) {
      console.error('Ошибка обновления отдела:', error);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при обновлении отдела',
      });
    }
  };

  return { updateDepartment };
}
