// ============================================================
// Project data — titles, descriptions, technologies, overviews,
// and key features are drawn from the matching GitHub
// repositories and their README files.
//
// The list page shows one row per project, and the dynamic
// route /projects/[slug] uses the same data for detail pages.
// ============================================================

export const projects = [
  {
    slug: "h1b-program-fairness-analysis",
    title: "H1B Program Fairness Analysis",
    shortDescription:
      "Analyzes H1B certification trends, salaries, and job roles to reveal how fair and equitable the program is across industries.",
    technologies: ["Python", "Jupyter Notebook"],
    githubUrl: "https://github.com/sevgicosan/H1B-Program-Fairness-Analysis",
    overview: [
      "The H1B visa program is a crucial component of the U.S. labor market, allowing companies to hire foreign workers with high-level qualifications in fields such as technology, healthcare, and finance. Opinions differ, however, on whether the program is fair to both American and H1B employees, and whether it disproportionately benefits certain industries or occupations. This project — a group project for a Data Analysis with Python course — analyzes trends in H1B certifications, salaries, and occupations to explore how equitable the program is across industries and job categories.",
      "The analysis combines FY2024 H1B certification data from the Department of Labor with wage and employment statistics from the Bureau of Labor Statistics. It tests three hypotheses: whether H1B holders receive higher average salaries than the national average for comparable occupations, and whether certain occupations and sectors benefit disproportionately from the program. The data is cleaned, merged, and transformed with pandas, applying descriptive statistics, correlation analysis, and standard deviation, with Seaborn used to visualize wage trends and distribution patterns.",
    ],
    keyFeatures: [
      "Tests three hypotheses on wage fairness and concentration of H1B certifications across occupations and industries",
      "Combines Department of Labor FY2024 H1B certification data with Bureau of Labor Statistics wage and employment data",
      "Applies descriptive statistics (mean, median, quantiles), correlation analysis, and standard deviation",
      "Seaborn visualizations comparing H1B salary distributions against national averages",
    ],
  },
  {
    slug: "mental-health-response-nlp-with-fine-tuned-distilgpt-2",
    title: "Mental Health Response NLP with Fine-tuned DistilGPT-2",
    shortDescription:
      "Fine-tunes DistilGPT-2 on a mental health conversation dataset to generate empathetic therapist-style responses to patient queries.",
    technologies: ["Python", "DistilGPT-2", "Jupyter Notebook"],
    githubUrl:
      "https://github.com/sevgicosan/Mental-Health-Response-NLP-with-Fine-tuned-DistilGPT-2",
    overview: [
      "A natural language processing project that fine-tunes DistilGPT-2, a lightweight GPT-2 variant, on a mental health conversation dataset. The goal is to teach the model to respond empathetically and appropriately to mental health-related prompts by learning from patient–therapist dialogues.",
      "The workflow loads and cleans a mental health conversation CSV dataset, then formats each entry with custom special tokens (<|patient|> and <|therapist|>). After a 95/5 train/test split, sample responses are generated with the pre-trained (untuned) model as a baseline. The model is then fine-tuned for 105 epochs using causal language modeling with Hugging Face Transformers and PyTorch on Google Colab GPUs, and the outputs before and after fine-tuning are compared on test examples and custom prompts.",
    ],
    keyFeatures: [
      "Formats patient–therapist dialogues with custom <|patient|> and <|therapist|> tokens",
      "Baseline evaluation of the untuned model before fine-tuning",
      "Fine-tuned for 105 epochs using causal language modeling",
      "Built with Hugging Face Transformers, PyTorch, and Pandas; trained on Google Colab GPUs",
    ],
  },
  {
    slug: "sustainable-urban-logistics-optimization",
    title: "Sustainable Urban Logistics Optimization",
    shortDescription:
      "Designs a sustainable last-mile delivery network using a full progression of optimization techniques.",
    technologies: ["HTML", "Python", "Jupyter Notebook"],
    githubUrl:
      "https://github.com/sevgicosan/Sustainable-Urban-Logistics-Optimization",
    overview: [
      "A capstone project for a Prescriptive Analytics course, designing a sustainable last-mile delivery network for case-study client GreenCity Logistics. The model makes four interlocking decisions — which of 25 candidate micro-fulfillment centers to open, which open facility serves each of 30 demand zones, which vehicle type serves each route, and how many daily trips are needed — while jointly minimizing cost, minimizing carbon emissions, and maximizing service quality under capacity, range, time-window, emission, and client-specific operational constraints.",
      "The model is built as a full progression of optimization techniques required by the course: an LP baseline to establish a cost lower bound, a min-cost network-flow formulation, a MIP with binary/integer decisions, a multi-objective weighted-sum model across cost, emissions, and service, and a nonlinear stage with BPR congestion-adjusted travel times feeding back into the MIP. The notebook is fully reproducible in Google Colab, includes sensitivity and scenario analysis, and closes with managerial recommendations, limitations, and extensions.",
    ],
    keyFeatures: [
      "Full optimization progression: LP baseline, min-cost network flow, MIP, multi-objective, and nonlinear congestion modeling",
      "Jointly optimizes cost, carbon emissions, and service quality",
      "Trade-off and sensitivity analysis across weight scenarios and parameter perturbations",
      "Reproducible in Google Colab with a Gurobi license; ~2–3 minute runtime",
    ],
  },
  {
    slug: "product-inventory",
    title: "Custom CLI Tool – Product Inventory",
    shortDescription:
      "A custom command-line tool for managing a product inventory, built with Python.",
    technologies: ["Python"],
    githubUrl: "https://github.com/sevgicosan/Custom_CLI_Tool__Product_Inventory-",
    overview: [
      "A Python 3 command-line tool for managing a small store's product inventory. The tool lets users add, list, retrieve, update, and delete products stored in a local JSON file, with automatically assigned IDs that are never reused after deletion. It is intended both for people learning how to build custom Python CLI commands and for small-store owners who want a simple way to check stock levels and plan replenishment.",
      "Beyond the basic inventory commands, the tool includes two custom features: a Low-Stock Report that finds products with quantities at or below a chosen threshold, and Reorder Planning that identifies products needing replenishment and calculates exactly how many additional units are needed to reach a target stock level. The tool validates inputs carefully — rejecting invalid IDs, empty names, invalid prices, and negative or fractional quantities — returns meaningful exit codes, and includes a unittest suite covering the full command set.",
    ],
    keyFeatures: [
      "Add, list, retrieve, update, and delete products stored in a local JSON file",
      "Low-Stock Report: finds products with quantities at or below a chosen threshold",
      "Reorder Planning: calculates how many units to order to reach a target stock level",
      "Robust validation with meaningful exit codes and a unittest test suite",
    ],
  },
];

// Returns the project object whose "slug" matches the URL, or
// undefined if no project matches (the page then shows a 404).
export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
