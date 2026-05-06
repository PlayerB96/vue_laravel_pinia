import { nextTick, onBeforeUnmount, ref } from 'vue';

/**
 * @param {object} options
 * @param {string} options.elementId - id del contenedor donde monta html5-qrcode
 * @param {(code: string) => void | Promise<void>} options.onDecode - código leído (cámara ya detenida)
 * @param {() => void} [options.onClosed] - tras cerrar overlay manualmente o error
 */
export function useBarcodeScanner({ elementId, onDecode, onClosed }) {
    const scanning = ref(false);
    const startingCamera = ref(false);
    const cameraError = ref('');

    let html5QrCode = null;
    let scanConsumed = false;

    async function stopCameraInternal() {
        if (!html5QrCode) {
            return;
        }
        try {
            if (html5QrCode.isScanning) {
                await html5QrCode.stop();
            }
            html5QrCode.clear();
        } catch {
            //
        }
        html5QrCode = null;
    }

    async function closeScanner() {
        startingCamera.value = false;
        cameraError.value = '';
        await stopCameraInternal();
        scanning.value = false;
        onClosed?.();
    }

    function qrBoxDimensions(viewfinderWidth, viewfinderHeight) {
        const edge = Math.min(viewfinderWidth, viewfinderHeight);

        return {
            width: Math.floor(edge * 0.92),
            height: Math.floor(edge * 0.36),
        };
    }

    async function onScanSuccess(decodedText) {
        if (scanConsumed) {
            return;
        }
        scanConsumed = true;
        await stopCameraInternal();
        scanning.value = false;
        startingCamera.value = false;
        await onDecode(decodedText.trim());
    }

    async function openScanner() {
        cameraError.value = '';

        const host = typeof window !== 'undefined' ? window.location.hostname : '';
        const localHost = host === 'localhost' || host === '127.0.0.1';
        if (typeof window !== 'undefined' && !window.isSecureContext && !localHost) {
            cameraError.value = 'La cámara solo está disponible con HTTPS (excepto en localhost).';

            return;
        }

        scanning.value = true;
        scanConsumed = false;
        startingCamera.value = true;

        await nextTick();

        try {
            const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');

            const barcodeFormats = [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.CODE_39,
            ];

            html5QrCode = new Html5Qrcode(elementId, {
                verbose: false,
                formatsToSupport: barcodeFormats,
            });

            await html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: qrBoxDimensions,
                },
                onScanSuccess,
                () => {},
            );
        } catch (err) {
            await stopCameraInternal();
            scanning.value = false;
            const msg = err instanceof Error ? err.message : String(err);
            if (/Permission|NotAllowed|denied/i.test(msg)) {
                cameraError.value = 'Permiso de cámara denegado. Actívalo en la configuración del navegador.';
            } else if (/NotFound|no camera|DevicesNotFound/i.test(msg)) {
                cameraError.value = 'No se detectó ninguna cámara en este dispositivo.';
            } else {
                cameraError.value = 'No se pudo abrir la cámara. Intenta de nuevo o ingresa el código a mano.';
            }
            onClosed?.();
        } finally {
            startingCamera.value = false;
        }
    }

    onBeforeUnmount(async () => {
        await stopCameraInternal();
    });

    return {
        scanning,
        startingCamera,
        cameraError,
        openScanner,
        closeScanner,
    };
}
