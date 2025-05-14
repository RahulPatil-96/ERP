type ToastVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info';

interface ToastOptions {
  title: string;
  variant?: ToastVariant;
}

export function useToast() {
  return {
    toast: (options: ToastOptions) => {
      console.log('Toast:', options.title, options.variant);
      // In a real implementation, this would show a toast notification
    }
  };
}
