from huggingface_hub import snapshot_download

snapshot_download(
    repo_id="mlc-ai/Phi-3-mini-4k-instruct-q4f16_1-MLC",
    local_dir="models/phi-3",
    local_dir_use_symlinks=False
)