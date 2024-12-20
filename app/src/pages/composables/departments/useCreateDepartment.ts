import { useQuasar } from 'quasar';
import axios from 'axios';
import { departmentSchema } from 'src/pages/shemas/Departmant.shemas';

// Тип для данных отдела
interface DepartmentInput {
  id?: number;
  deleted_at?: Date | null;
  name: string;
  comment?: string;
  parent_id?: number | null;
  organisation_id?: number | null;
}

export function useCreateDepartment(loadDepartments: () => Promise<void>) {
  const $q = useQuasar();

  const createDepartment = async (departmentData: DepartmentInput) => {
    // Удаляем запрещённые поля
    const sanitizedData: DepartmentInput = { ...departmentData };
    delete sanitizedData.id;
    delete sanitizedData.deleted_at;

    // Валидация
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
      await axios.post('http://localhost:3000/departments', sanitizedData, {
        withCredentials: true,
      });
      await loadDepartments();
      $q.notify({ type: 'positive', message: 'Отдел успешно добавлен' });
    } catch (error) {
      console.error('Ошибка создания отдела:', error);
      $q.notify({ type: 'negative', message: 'Ошибка при создании отдела' });
    }
  };

  return { createDepartment };
}
