const fs = require('fs');
const path = require('path');

// Paths
const COMPANY_FILE = path.join(__dirname, 'solution_company_db_20240826.json');
const SOLUTION_FILE = path.join(__dirname, 'solution_db_20240704.json');
const COMPANY_OUT = path.join(__dirname, 'solution_company_db_v2.json');
const SOLUTION_OUT = path.join(__dirname, 'solution_db_v2.json');

// Helper to fallback to empty string
function val(v) {
  return v || "";
}

function transform() {
  console.log('Starting transformation...');

  // 1. Load Data
  if (!fs.existsSync(COMPANY_FILE) || !fs.existsSync(SOLUTION_FILE)) {
    console.error('Source files not found!');
    process.exit(1);
  }

  const companies = JSON.parse(fs.readFileSync(COMPANY_FILE, 'utf8'));
  const solutions = JSON.parse(fs.readFileSync(SOLUTION_FILE, 'utf8'));

  console.log(`Loaded ${companies.length} companies and ${solutions.length} solutions.`);

  // 2. Transform Companies
  const newCompanies = companies.map(c => {
    return {
      companyId: String(c.companyId), // Use original ID as String
      ko: {
        name: val(c.name),
        ceo: val(c.ceo),
        address: val(c.address),
        tel: val(c.tel),
        fax: val(c.fax),
        website: val(c.website)
      },
      en: {
        name: val(c.nameEng),
        ceo: "",
        address: "",
        tel: "",
        fax: "",
        website: ""
      }
    };
  });

  // 3. Transform Solutions
  const newSolutions = solutions.map(s => {
    return {
      solutionId: String(s.solutionId), // Use original ID as String
      companyId: String(s.companyId),   // Use original ID as String
      mainCategoryId: s.mainCategoryId,
      subCategoryId: s.subCategoryId,
      ko: {
        title: val(s.title),
        summary: val(s.summary),
        abstract: val(s.abstract),
        feature: val(s.feature),
        composition: val(s.composition)
      },
      en: {
        title: "",
        summary: "",
        abstract: "",
        feature: "",
        composition: ""
      }
    };
  });

  // 4. Save
  fs.writeFileSync(COMPANY_OUT, JSON.stringify(newCompanies, null, 2), 'utf8');
  fs.writeFileSync(SOLUTION_OUT, JSON.stringify(newSolutions, null, 2), 'utf8');

  console.log(`Transformation complete!`);
  console.log(`Companies saved to: ${COMPANY_OUT}`);
  console.log(`Solutions saved to: ${SOLUTION_OUT}`);
}

transform();
