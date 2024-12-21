import { useQuasar } from 'quasar';
import axios from 'axios';

export const useDeleteOrganization = (
  loadOrganizations: () => Promise<void>
) => {
  const $q = useQuasar();

  const deleteOrganizationHandler = async (orgId: number) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/organizations/${orgId}/soft-delete`,
        {},
        { withCredentials: true }
      );
      console.log('Response:', response.data);
      await loadOrganizations();
      $q.notify({ type: 'positive', message: 'Организация успешно удалена' });
    } catch (err) {
      console.error('Ошибка удаления организации:', err);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при удалении организации',
      });
    }
  };

  return { deleteOrganizationHandler };
};
