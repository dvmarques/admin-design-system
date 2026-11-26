import '@testing-library/jest-dom/vitest';

function blobToStream(blob: Blob): ReadableStream<Uint8Array<ArrayBuffer>> {
	return new ReadableStream<Uint8Array<ArrayBuffer>>({
		start(controller) {
			const reader = new FileReader();
			reader.onload = () => {
				controller.enqueue(new Uint8Array(reader.result as ArrayBuffer));
				controller.close();
			};
			reader.onerror = () => controller.error(reader.error);
			reader.readAsArrayBuffer(blob);
		},
	});
}

// O jsdom não implementa Blob#stream, usado pelo wasm embutido do Oniguruma (shiki >= 4.6).
// O polyfill só existe no ambiente de testes; navegadores e Node já oferecem o método.
if (typeof Blob !== 'undefined' && typeof Blob.prototype.stream !== 'function') {
	Blob.prototype.stream = function stream(this: Blob) {
		return blobToStream(this);
	};
}
