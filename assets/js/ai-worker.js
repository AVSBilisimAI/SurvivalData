// DÜZELTME: Tarayıcı worker'ının kütüphaneyi localhost üzerinde tam adresiyle bulabilmesi için yol güncellendi
importScripts(self.location.origin + "/assets/js/transformers.min.js");

const { pipeline, env } = transformers;

// İndirdiğin wasm dosyasının yolu
env.backends.onnx.wasm.wasmPaths = '../../assets/wasm/';

let generator = null;

self.onmessage = async (event) => {
    const data = event.data;

    if (data.action === 'init') {
        try {
            console.log("[AI-Worker] Yerel kütüphane başarıyla yüklendi. Model indirmesi başlatılıyor...");
            
            generator = await pipeline('text-generation', 'onnx-community/Llama-3.2-1B-Instruct-ONNX', {
                device: 'wasm',
                dtype: 'q4',
                progress_callback: (p) => {
                    self.postMessage({ status: 'progress', data: p });
                }
            });
            
            console.log("[AI-Worker] Model başarıyla yüklendi ve hazır.");
            self.postMessage({ status: 'ready' });
        } catch (err) {
            console.error("[AI-Worker Init Hatası]:", err);
            self.postMessage({ status: 'error', message: err.message });
        }
    }

    if (data.action === 'generate') {
        const messages = [
            { 
                role: "system", 
                content: "Sen AVS afet ve kriz yapay zekasısın. Görevin sadece Türkçe cevap vermektir. Kısa, net ve maddeler halinde bir kriz analizi yap." 
            },
            { 
                role: "user", 
                content: "Aşağıdaki afet verilerine göre " + data.query + " durumunu analiz et.\n\nBağlam:\n" + data.context.substring(0, 400) 
            }
        ];

        try {
            const result = await generator(messages, { 
                max_new_tokens: 60, 
                temperature: 0.1, 
                repetition_penalty: 1.2 
            });
            
            let text = typeof result.generated_text === 'string' ? result.generated_text : result.generated_text[result.generated_text.length - 1].content;
            text = text.replace(/<|\>\/|system|user|assistant|\[INST\]|\[\/INST\]/g, "").trim();
            
            self.postMessage({ status: 'complete', result: text });
        } catch (err) {
            self.postMessage({ status: 'error', message: err.message });
        }
    }
};
