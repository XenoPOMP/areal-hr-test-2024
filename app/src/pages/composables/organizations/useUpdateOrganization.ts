import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { organizationSchema } from 'src/pages/shemas/Organization.shemas';
import { updateOrganization } from 'src/api/organizations';

export const useUpdateOrganization = (
  loadOrganizations: () => Promise<void>
) => {
  const $q = useQuasar();

  const editMode = ref(false);
  const editedOrganization = ref<{
    id: string;
    name: string;
    comment: string;
  } | null>(null);

  const startEditingOrganization = (organization: {
    id: string;
    name: string;
    comment: string;
  }) => {
    editedOrganization.value = { ...organization };
    editMode.value = true;
  };

  const cancelEdit = () => {
    editMode.value = false;
    editedOrganization.value = null;
  };

  const updateOrganizationHandler = async () => {
    if (!editedOrganization.value) return;

    const organizationData = {
      name: editedOrganization.value.name,
      comment: editedOrganization.value.comment,
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
      await updateOrganization(editedOrganization.value.id, organizationData);
      await loadOrganizations();
      cancelEdit();
      $q.notify({
        type: 'positive',
        message: 'Организация успешно обновлена',
      });
    } catch (err) {
      console.error('Ошибка обновления организации:', err);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при обновлении организации',
      });
    }
  };

  return {
    editMode,
    editedOrganization,
    startEditingOrganization,
    cancelEdit,
    updateOrganizationHandler,
  };
};
