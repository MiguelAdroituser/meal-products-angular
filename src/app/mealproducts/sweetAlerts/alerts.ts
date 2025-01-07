import Swal from "sweetalert2";

export const showAlertSuccess = ( message: string ) => {

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500
  });

}

export const showAlertError = ( message: string ) => {

  Swal.fire({
    position: "top-end",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 1500
  });

}

export const showAlertConfirm = async(): Promise<boolean> => {

  let response:boolean = false;

  await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {

     response = true;

    }
  });

  return response;

}
