// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useQuasar, QNotifyCreateOptions } from 'quasar';
import axios from 'axios';
import {
  EmployeeBaseData,
  PassportInfo,
  AddressInfo,
} from 'src/pages/types/Employee';
import { getSessionUserId } from 'src/useSession';
import { employeeSchema } from 'src/pages/shemas/Employee.shemas';

const useCreateEmployee = () => {
  // Функция для форматирования даты
  const formatDate = (date: string | Date | null): string | null => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Основная логика создания сотрудника
  const createEmployee = async (
    employeeBaseData: EmployeeBaseData,
    passportInfo: PassportInfo,
    addressInfo: AddressInfo,
    $q: ReturnType<typeof useQuasar>
  ): Promise<boolean> => {
    const userId = await getSessionUserId();
    if (!userId) return false;

    // Формирование данных паспорта
    const passportData = {
      serial: passportInfo.serial,
      number: passportInfo.number,
      date_issue: formatDate(passportInfo.date_issue),
      issued_by: passportInfo.issued_by,
      code: passportInfo.code || '',
    };

    // Формирование данных адреса
    const addressData = {
      region: addressInfo.region,
      settlement: addressInfo.settlement,
      street: addressInfo.street,
      house: addressInfo.house || '',
      housing: addressInfo.housing || '',
      flat: addressInfo.flat || '',
    };

    // Формирование данных сотрудника
    const employeePayload = {
      name: employeeBaseData.name,
      surname: employeeBaseData.surname,
      second_name: employeeBaseData.second_name || '',
      date_birth: formatDate(employeeBaseData.date_birth),
      position_id: employeeBaseData.position_id,
      passportData,
      addressData,
    };

    if (!validateEmployee(employeePayload, $q)) return false;

    try {
      const response = await axios.post(
        'http://localhost:3000/employees',
        employeePayload,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        $q.notify({
          type: 'positive',
          message: 'Сотрудник успешно добавлен!',
        });
        return true;
      } else {
        throw new Error('Не удалось добавить сотрудника');
      }
    } catch (error) {
      console.error('Ошибка при добавлении сотрудника:', error);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при добавлении сотрудника. Попробуйте еще раз.',
      });
      return false;
    }
  };

  return { createEmployee };
};

// Валидация данных сотрудника
const validateEmployee = (
  employeeData: Record<string, unknown>,
  $q: ReturnType<typeof useQuasar>
): boolean => {
  const { error } = employeeSchema.validate(employeeData, {
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

export default useCreateEmployee;
