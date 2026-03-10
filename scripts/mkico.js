// Run: node scripts/mkico.js
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const PNG = path.resolve(__dirname, "../electron/resources/icon.png");
const ICO = path.resolve(__dirname, "../electron/resources/icon.ico");

const ps1 = path.join(os.tmpdir(), "mkico_" + Date.now() + ".ps1");

const script = [
    "Add-Type -AssemblyName System.Drawing",
    "$p = [System.Drawing.Image]::FromFile('" + PNG.replace(/\\/g, "\\\\") + "')",
    "$sz = @(256,128,64,48,32,16)",
    "$ms = New-Object System.IO.MemoryStream",
    "$bw = New-Object System.IO.BinaryWriter($ms)",
    "$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$sz.Count)",
    "$imgs = New-Object System.Collections.ArrayList",
    "$off = 6 + $sz.Count * 16",
    "foreach ($s in $sz) {",
    "  $bmp = New-Object System.Drawing.Bitmap($p,$s,$s)",
    "  $im = New-Object System.IO.MemoryStream",
    "  $bmp.Save($im,[System.Drawing.Imaging.ImageFormat]::Png)",
    "  $by = $im.ToArray()",
    "  [void]$imgs.Add($by)",
    "  $im.Close(); $bmp.Dispose()",
    "  $w = if($s -eq 256){[byte]0}else{[byte]$s}",
    "  $bw.Write($w); $bw.Write($w); $bw.Write([byte]0); $bw.Write([byte]0)",
    "  $bw.Write([uint16]1); $bw.Write([uint16]32); $bw.Write([uint32]$by.Length); $bw.Write([uint32]$off)",
    "  $off += $by.Length",
    "}",
    "foreach ($by in $imgs) { $bw.Write($by) }",
    "$p.Dispose()",
    "[System.IO.File]::WriteAllBytes('" + ICO.replace(/\\/g, "\\\\") + "', $ms.ToArray())",
    "$bw.Close(); $ms.Close()",
    "Write-Host 'ICO_DONE'"
].join("\r\n");

fs.writeFileSync(ps1, script, "utf8");
try {
    const out = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${ps1}"`, { encoding: "utf8" });
    console.log(out.trim());
    const sz = fs.statSync(ICO).size;
    console.log("icon.ico:", sz, "bytes", sz > 10000 ? "✓ OK" : "✗ Too small");
} finally {
    try { fs.unlinkSync(ps1); } catch (_) { }
}
