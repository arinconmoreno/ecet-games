export interface Contact {
  name: string;
  email: string;
}

export const CONTACTS: Contact[] = [
  { name: "Alejandra Calderon Moncada", email: "alejandra.calderon@sofka.com.co" },
  { name: "Andres Rincon Moreno", email: "andres.rincon@sofka.com.co" },
  { name: "Claudia Jaramillo Mazo", email: "claudia.jaramillo@sofka.com.co" },
  { name: "Diego Alexander Barragan Forero", email: "diego.barragan@sofka.com.co" },
  { name: "Luis Felipe Reyes Rivera", email: "luis.reyes@sofka.com.co" },
  { name: "Allison Usuga Usuga", email: "allison.usuga@sofka.com.co" },
  { name: "Andres Felipe Mira Tabares", email: "andres.mira@sofka.com.co" },
  { name: "Brian Steven Torres Velasquez", email: "brian.torres@sofka.com.co" },
  { name: "Carlos Andres Jaramillo Toro", email: "carlos.jaramillo@sofka.com.co" },
  { name: "Carlos Daniel Romo Buitrago", email: "compras@sofka.com.co" },
  { name: "Cindy Yiseth Romero Ortiz", email: "cindy.romero@sofka.com.co" },
  { name: "Cristofer Buitrago Cocoma", email: "david.buitrago@sofka.com.co" },
  { name: "David Esteban Peña Chavez", email: "david.pena@sofka.com.co" },
  { name: "Denny Luz Hurtado Mosquera", email: "denny.hurtado@sofka.com.co" },
  { name: "Diego Torres Lopez", email: "juan.torres@sofka.com.co" },
  { name: "Dora Alicia Dávila Sánchez", email: "dora.davila@sofka.com.co" },
  { name: "Edison Andrés Gutierrez Villa", email: "edison.gutierrez@sofka.com.co" },
  { name: "Esteban Restrepo Cardona", email: "esteban.restrepo@sofka.com.co" },
  { name: "Faber Rua Zuleta", email: "faber.rua@sofka.com.co" },
  { name: "Jhonatan Quintero Zuluaga", email: "jhonatan.quintero@sofka.com.co" },
  { name: "Jhonathan David Casallas Velasquez", email: "jhonathan.casallas@sofka.com.co" },
  { name: "Jorge Daniel Aya Lozano", email: "jorge.aya@sofka.com.co" },
  { name: "Karen Sofia Sativa Gonzalez", email: "karen.sativa@sofka.com.co" },
  { name: "Katherin Hernández Ramírez", email: "katherin.hernandez@sofka.com.co" },
  { name: "Katheryne Gallego Cruz", email: "katheryne.gallego@sofka.com.co" },
  { name: "Kelly Tamayo Sanmartin", email: "kelly.tamayo@sofka.com.co" },
  { name: "Kerly Belen Bravo Ante", email: "kerly.bravo@sofka.com.co" },
  { name: "Leonardo Parra Amariles", email: "jose.parra@sofka.com.co" },
  { name: "Lilian Julieth Quintero Franco", email: "lilian.quintero@sofka.com.co" },
  { name: "Lorena Trejos Paez", email: "lorena.trejos@sofka.com.co" },
  { name: "Luz Elizabeth Ahumada Neme", email: "luz.ahumada@sofka.com.co" },
  { name: "María del Pilar Bravo Costa", email: "maria.bravo@sofka.com.co" },
  { name: "Maria Fernanda Sáez Contreras", email: "maria.saez@sofka.com.co" },
  { name: "María José Rodríguez Tenorio", email: "maria.rodriguez@sofka.com.co" },
  { name: "María Nelyda Pulido Sánchez", email: "maria.pulido@sofka.com.co" },
  { name: "Mariana Marin Ruiz", email: "mariana.marin@sofka.com.co" },
  { name: "Mateo Villalo Mogollon", email: "mateo.villalo@sofka.com.co" },
  { name: "Merlyn Johana Valencia Garzon", email: "merlyn.valencia@sofka.com.co" },
  { name: "Natalia Jaramillo", email: "administrativo@sofka.com.co" },
  { name: "Nicolas Vargas Flores", email: "nicolas.vargas@sofka.com.co" },
  { name: "Salomé Urrego Cano", email: "salome.urrego@sofka.com.co" },
  { name: "Sandra Milena Cardona Ocampo", email: "sandra.cardona@sofka.com.co" },
  { name: "Tatiana Vanessa Olarte Ordoñez", email: "tatiana.olarte@sofka.com.co" },
  { name: "Yenifer Guaje Niño", email: "yenifer.guaje@sofka.com.co" },
];

export const ADMIN_EMAILS = [
  "andres.mira@sofka.com.co",
  "andres.rincon@sofka.com.co",
  "david.buitrago@sofka.com.co",
  "alejandra.calderon@sofka.com.co",
];

export function isAuthorizedEmail(email: string): boolean {
  return CONTACTS.some((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.some((e) => e.toLowerCase() === email.toLowerCase());
}

export function getContactByEmail(email: string): Contact | undefined {
  return CONTACTS.find((c) => c.email.toLowerCase() === email.toLowerCase());
}
