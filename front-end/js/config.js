export const API_URL = "http://localhost:8080";

export const STATUS_LABELS = {
  todo: "A Fazer",
  doing: "Fazendo",
  done: "Concluído",
};

export const PRIORITY_LABELS = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

export const STATUS_FLOW = {
  todo: { next: "doing", label: "Iniciar" },
  doing: { next: "done", label: "Concluir", prev: "todo", prevLabel: "Voltar" },
  done: { prev: "doing", prevLabel: "Reabrir" },
};
