import { ref } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { EmployeeBaseData } from 'src/pages/types/Employee';
import { employeeSchema } from 'src/pages/shemas/Employee.shemas';

export function useUpdateEmployee(
  refreshCallback: () => void,
  cancelEditCallback: () => void
) {
  const isUpdating = ref(false);
  const error = ref<string | null>(null);
  const $q = useQuasar();

  const updateEmployee = async (editedEmployee: EmployeeBaseData | null) => {
    if (!editedEmployee) return;

    const payload = { ...editedEmployee };

    if (!validateEmployee(payload)) return;

    isUpdating.value = true;
    error.value = null;

    try {
      const response = await axios.put(
        `http://localhost:3000/employees/${editedEmployee.id}`,
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        $q.notify({
          type: 'positive',
          message: 'Данные сотрудника обновлены!',
        });
        refreshCallback(); // Обновить список сотрудников
        cancelEditCallback(); // Закрыть режим редактирования
      }
    } catch (err) {
      console.error('Ошибка при обновлении сотрудника:', err);
      error.value = 'Ошибка при обновлении сотрудника';
      $q.notify({
        type: 'negative',
        message: 'Ошибка при обновлении сотрудника',
      });
    } finally {
      isUpdating.value = false;
    }
  };

  const validateEmployee = (employeeData: Record<string, unknown>): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, passport_id, address_id, deleted_at, ...validData } =
      employeeData;

    const { error } = employeeSchema.validate(validData, {
      abortEarly: false,
    });

    if (error) {
      error.details.forEach((err) =>
        $q.notify({
          type: 'negative',
          message: err.message,
        })
      );
      return false;
    }

    return true;
  };

  return {
    isUpdating,
    error,
    updateEmployee,
  };
}
