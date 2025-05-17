import Swal from "sweetalert2";
import { ToastType } from "../types/toast";

const showToast = ({
  position,
  timer = 3000,
  icon,
  title,
}: ToastType): void => {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({ icon, title });
};

export default showToast;
