import { useSignal } from "@preact/signals";
import { Dialog } from "@headlessui/react";
import { setSecretKey } from "@/stores/secretKeyStore.ts";

export function EncryptionSecretPrompt(props: { loggedIn: boolean }) {
  const currentKey = true; // getSecretKey();

  if (!props.loggedIn) return null;
  if (currentKey) return null; // Don't show modal if key is set

  const isOpen = useSignal(currentKey ? false : true);
  const inputValue = useSignal("");

  return (
    <Dialog
      open={isOpen.value}
      onClose={() => {}}
      className="relative z-50"
    >
      <Dialog.Backdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="max-w-lg space-y-4 p-12 border bg-white border-gray-300/70 hover:border-gray-900 hover:bg-gray-50 rounded-lg shadow-md shadow-gray-400/20 overflow-hidden">
          <Dialog.Title className="text-lg font-bold">
            We really need your encryption key
          </Dialog.Title>
          <Dialog.Description className="text-gray-600">
            This will be use to decrypt your data!
          </Dialog.Description>

          <input
            type="text"
            value={inputValue}
            onInput={(e: Event) =>
              inputValue.value = (e?.target as HTMLInputElement)?.value}
            placeholder="Enter your secret key"
            required
            className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />

          <button
            onClick={() => {
              if (inputValue.value) {
                isOpen.value = false;
                setSecretKey(inputValue.value);
                inputValue.value = "";
              }
            }}
            className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition"
          >
            Decrypt!
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
