import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const jobAreas = [
'Advogado (a)',
'Médico (a)',
'Engenheiro (a) Civil',
'Engenheiro (a) de Produção',
'Engenheiro (a) Elétrico (a)',
'Arquiteto (a)',
'Professor (a)',
'Enfermeiro (a)',
'Farmacêutico (a)',
'Psicólogo (a)',
'Contador (a)',
'Jornalista',
'Publicitário (a)',
'Designer Gráfico',
'Analista de Sistemas',
'Biomédico (a)',
'Nutricionista',
'Veterinário (a)',
'Fisioterapeuta',
'Assistente Social',
'Geólogo (a)',
'Odontólogo (a)',
'Auditor (a)',
'Economista',
'Químico (a)',
'Administrador (a)',
'Relações Públicas',
'Técnico (a) em Enfermagem',
'Técnico (a) em Segurança do Trabalho',
'Técnico (a) em Informática',
'Eletricista',
'Mecânico (a)',
'Técnico (a) em Radiologia',
'Técnico (a) em Logística',
'Técnico (a) em Manutenção Industrial',
'Técnico (a) em Automação',
'Cabeleireiro (a)',
'Barbeiro',
'Diarista',
'Cozinheiro (a)',
'Garçom/Garçonete',
'Vendedor (a)',
'Motorista',
'Operador (a) de Máquinas',
'Frentista',
'Balconista',
'Recepcionista',
'Auxiliar Administrativo',
'Auxiliar de Limpeza',
'Jardineiro (a)',
'Pintor (a)',
'Carpinteiro (a)',
'Pedreiro (a)',
'Encanador (a)',
'Ajudante Geral',
'Segurança/Vigilante',
'Estoquista',
'Caixa',
'Atendente de Lanchonete',
'Cuidador (a) de Idosos',
'Babá',
'Porteiro (a)',
'Entregador (a)',
'Fotógrafo (a)',
'Artista Plástico (a)',
'Dançarino (a)',
'Ator/Atriz',
'Músico (a)',
'Produtor (a) de Eventos',
'Escritor (a)',
'Cineasta',
'Agricultor (a)',
'Pecuarista',
'Pescador (a)',
'Trabalhador (a) Rural',
'Apicultor (a)',
];

async function main() {
  console.log("Seeding job areas...");

  for (const title of jobAreas) {
    await prisma.jobArea.upsert({
      where: { title },
      update: {},
      create: { title },
    });
  }

  console.log("Job areas seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });