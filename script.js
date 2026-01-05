let registros = JSON.parse(localStorage.getItem("registros")) || [];
let chart;

const tabela = document.getElementById("tabela");
const pesoAtual = document.getElementById("pesoAtual");
const statusAtual = document.getElementById("statusAtual");
const evolucao = document.getElementById("evolucao");

function login() {
  const nome = document.getElementById("nome").value;
  if (!nome) return alert("Digite seu nome");
  localStorage.setItem("usuario", nome);
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

if (localStorage.getItem("usuario")) {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

function adicionar() {
  const data = document.getElementById("data").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const jejum = document.getElementById("jejum").value;

  if (!data || !peso) return alert("Preencha data e peso");

  registros.push({ data, peso, jejum });
  localStorage.setItem("registros", JSON.stringify(registros));
  atualizar();
}

function atualizar() {
  tabela.innerHTML = "";

  registros.forEach((r, i) => {
    let variacao = i === 0 ? "-" : (r.peso - registros[i - 1].peso).toFixed(1);
    let status = variacao < 0 ? "Evoluindo" : variacao > 0 ? "Atenção" : "Estável";

    tabela.innerHTML += `
      <tr>
        <td>${r.data}</td>
        <td>${r.peso} kg</td>
        <td>${r.jejum}</td>
        <td>${variacao}</td>
        <td>${status}</td>
      </tr>
    `;
  });

  if (registros.length) {
    const inicio = registros[0].peso;
    const atual = registros.at(-1).peso;

    pesoAtual.innerText = atual + " kg";
    evolucao.innerText = (atual - inicio).toFixed(1) + " kg";

    statusAtual.innerText =
      atual < inicio ? "Evoluindo" :
      atual > inicio ? "Atenção" : "Estável";
  }

  gerarGrafico();
}

function gerarGrafico() {
  const ctx = document.getElementById("grafico");
  const labels = registros.map(r => r.data);
  const pesos = registros.map(r => r.peso);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Peso (kg)",
        data: pesos,
        tension: 0.3
      }]
    }
  });
}

function exportar() {
  let csv = "Data,Peso,Jejum\n";
  registros.forEach(r => {
    csv += `${r.data},${r.peso},${r.jejum}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "controle-jejum.csv";
  link.click();
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

atualizar();