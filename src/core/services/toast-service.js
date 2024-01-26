import 'react-toastify/dist/ReactToastify.css';

export function configureToastOptions() {
    return {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 500
    };
}
