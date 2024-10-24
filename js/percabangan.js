const problems = [
    {
        question: `<h3>Cek Bilangan Positif/Negatif</h3>
                  <p>Buatlah program Python yang menerima input bilangan dan menentukan apakah bilangan tersebut positif atau negatif.</p>
                  <p>Contoh input: -5</p>
                  <p>Contoh output: "Bilangan negatif"</p>`,
        solution: `num = int(input("Masukkan bilangan: "))
if num > 0:
print("Bilangan positif")
elif num < 0:
print("Bilangan negatif")
else:
print("Nol")`
    },
    {
        question: `<h3>Nilai Mahasiswa</h3>
                  <p>Buatlah program untuk menentukan nilai huruf berdasarkan nilai angka dengan ketentuan:</p>
                  <ul>
                      <li>A: 85-100</li>
                      <li>B: 70-84</li>
                      <li>C: 55-69</li>
                      <li>D: 40-54</li>
                      <li>E: 0-39</li>
                  </ul>`,
        solution: `nilai = float(input("Masukkan nilai: "))
if nilai >= 85:
print("A")
elif nilai >= 70:
print("B")
elif nilai >= 55:
print("C")
elif nilai >= 40:
print("D")
else:
print("E")`
    },
    {
        question: `<h3>Tahun Kabisat</h3>
                  <p>Buatlah program untuk menentukan apakah suatu tahun adalah tahun kabisat atau bukan.</p>
                  <p>Tahun kabisat adalah tahun yang habis dibagi 4, kecuali tahun yang habis dibagi 100 tetapi tidak habis dibagi 400.</p>`,
        solution: `tahun = int(input("Masukkan tahun: "))
if (tahun % 4 == 0 and tahun % 100 != 0) or (tahun % 400 == 0):
print("Tahun Kabisat")
else:
print("Bukan Tahun Kabisat")`
    },
    {
        question: `<h3>Kalkulator Sederhana</h3>
                  <p>Buatlah kalkulator sederhana yang menerima dua bilangan dan operator (+, -, *, /) kemudian menampilkan hasilnya.</p>
                  <p>Contoh input: 10 + 5</p>
                  <p>Contoh output: "Hasil: 15"</p>`,
        solution: `a = float(input("Bilangan pertama: "))
op = input("Operator (+,-,*,/): ")
b = float(input("Bilangan kedua: "))

if op == '+':
print(f"Hasil: {a + b}")
elif op == '-':
print(f"Hasil: {a - b}")
elif op == '*':
print(f"Hasil: {a * b}")
elif op == '/':
if b != 0:
print(f"Hasil: {a / b}")
else:
print("Tidak bisa dibagi dengan nol")`
    },
    {
        question: `<h3>Validasi Password</h3>
                  <p>Buatlah program untuk memvalidasi password dengan kriteria:</p>
                  <ul>
                      <li>Minimal 8 karakter</li>
                      <li>Mengandung huruf besar dan kecil</li>
                      <li>Mengandung angka</li>
                  </ul>`,
        solution: `password = input("Masukkan password: ")
has_upper = any(c.isupper() for c in password)
has_lower = any(c.islower() for c in password)
has_digit = any(c.isdigit() for c in password)

if len(password) < 8:
print("Password terlalu pendek")
elif not has_upper:
print("Password harus mengandung huruf besar")
elif not has_lower:
print("Password harus mengandung huruf kecil")
elif not has_digit:
print("Password harus mengandung angka")
else:
print("Password valid")`
    }
];

let currentQuestion = 0;
let editor;

document.addEventListener('DOMContentLoaded', function() {
    editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
        mode: "python",
        theme: "monokai",
        lineNumbers: true,
        indentUnit: 4,
        lineWrapping: true
    });

    updateQuestion();
});

function updateQuestion() {
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    document.getElementById('currentProblem').innerHTML = problems[currentQuestion].question;
    document.getElementById('solution').style.display = 'none';
    document.getElementById('solution').innerHTML = `<pre>${problems[currentQuestion].solution}</pre>`;
    editor.setValue('# Tulis kode Anda di sini\n');
    
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.toggle('active', index <= currentQuestion);
    });

    // Update buttons
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').disabled = currentQuestion === problems.length - 1;
}

function nextQuestion() {
    if (currentQuestion < problems.length - 1) {
        currentQuestion++;
        updateQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        updateQuestion();
    }
}

function toggleSolution() {
    const solution = document.getElementById('solution');
    solution.style.display = solution.style.display === 'none' ? 'block' : 'none';
}

function runCode() {
    const code = editor.getValue();
    document.getElementById('output').innerHTML = 
        '<p style="color: #666;">// Output akan ditampilkan di sini ketika backend sudah diimplementasikan</p>';
}