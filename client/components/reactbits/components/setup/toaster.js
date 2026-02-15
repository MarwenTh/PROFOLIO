import { toast } from 'sonner';

export const toaster = {
  create: ({ title, description, type, duration }) => {
    const message = title ? `${title}: ${description}` : description;
    if (type === 'error') {
      toast.error(message, { duration });
    } else if (type === 'success') {
      toast.success(message, { duration });
    } else {
      toast(message, { duration });
    }
  },
  dismiss: () => toast.dismiss(),
  promise: (promise, data) => toast.promise(promise, data)
};
