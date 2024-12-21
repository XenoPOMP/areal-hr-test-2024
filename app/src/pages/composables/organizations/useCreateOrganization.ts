import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { organizationSchema } from 'src/pages/shemas/Organization.shemas';
import { createOrganization } from 'src/api/organizations';

export const useCreateOrganization = (
  loadOrganizations: () => Promise<void>
) => {
  const $q = useQuasar();

  const newOrganization = ref({
    id: '',
    name: '',
    comment: '',
  });

  const createOrganizationHandler = async () => {
    const organizationData = {
      name: newOrganization.value.name,
      comment: newOrganization.value.comment,
    };

    const { error } = organizationSchema.validate(organizationData, {
      abortEarly: false,
    });

    if (error) {
      error.details.forEach((err) =>
        $q.notify({ type: 'negative', message: err.message })
      );
      return;
    }

    try {
      await createOrganization(organizationData);
      newOrganization.value = { id: '', name: '', comment: '' };
      await loadOrganizations();
      $q.notify({ type: 'positive', message: 'Организация успешно добавлена' });
    } catch (err) {
      console.error('Ошибка добавления организации:', err);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при добавлении организации',
      });
    }
  };

  return {
    newOrganization,
    createOrganizationHandler,
  };
};
