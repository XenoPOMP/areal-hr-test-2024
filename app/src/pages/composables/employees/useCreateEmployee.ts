import { ref } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { employeeSchema } from 'src/pages/shemas/Employee.shemas';
import { PassportInfo, AddressInfo } from 'src/pages/types/Employee';
import { getSessionUserId } from 'src/useSession';

export function useCreateEmployee() {
  const $q = useQuasar();
  const employeeBaseData = ref({
    name: '',
    surname: '',
    second_name: '',
    date_birth: '',
    position_id: null,
    passport: {
      serial: '',
      number: '',
      date_issue: '',
      code: '',
      issued_by: '',
    },
    address: {
      region: '',
      settlement: '',
      street: '',
      house: '',
      housing: '',
      flat: '',
    },
  });

  const clearForm = () => {
    employeeBaseData.value = {
      name: '',
      surname: '',
      second_name: '',
      date_birth: '',
      position_id: null,
      passport: {
        serial: '',
        number: '',
        date_issue: '',
        code: '',
        issued_by: '',
      },
      address: {
        region: '',
        settlement: '',
        street: '',
        house: '',
        housing: '',
        flat: '',
      },
    };
  };

  const passportInfo = ref<PassportInfo>({
    serial: '',
    number: '',
    date_issue: '',
    issued_by: '',
    code: '',
  });

  const addressInfo = ref<AddressInfo>({
    region: '',
    settlement: '',
    street: '',
    house: '',
    housing: '',
    flat: '',
  });

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

  const createEmployeeHandler = async (
    employeePayload: Record<string, unknown>
  ) => {
    const userId = await getSessionUserId();
    if (!userId) return;

    const passportData = {
      serial: passportInfo.value.serial,
      number: passportInfo.value.number,
      date_issue: formatDate(passportInfo.value.date_issue),
      issued_by: passportInfo.value.issued_by,
      code: passportInfo.value.code || '',
    };

    // Формирование данных адреса
    const addressData = {
      region: addressInfo.value.region,
      settlement: addressInfo.value.settlement,
      street: addressInfo.value.street,
      house: addressInfo.value.house || '',
      housing: addressInfo.value.housing || '',
      flat: addressInfo.value.flat || '',
    };

    const employeePayloadWithUser = {
      ...employeePayload,
      userId, // Добавляем userId в объект данных сотрудника
      passportData,
      addressData,
    };

    if (!validateEmployee(employeePayloadWithUser)) {
      $q.notify({
        type: 'negative',
        message: 'Проверьте корректность введенных данных.',
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/employees',
        employeePayloadWithUser,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        $q.notify({
          type: 'positive',
          message: 'Сотрудник успешно добавлен!',
        });
        clearForm();
      } else {
        throw new Error('Не удалось добавить сотрудника');
      }
    } catch (error) {
      console.error('Ошибка при добавлении сотрудника:', error);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при добавлении сотрудника. Попробуйте еще раз.',
      });
    }
  };

  const formatDate = (date: string | Date | null): string | null => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return {
    employeeBaseData,
    createEmployeeHandler,
    clearForm,
  };
}
