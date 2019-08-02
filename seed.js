const mongoose = require('mongoose');
const Stores = require('./models/company');

const dbtitle = 'phoenix-api';
mongoose.connect(`mongodb://localhost/${dbtitle}`);
Stores.collection.drop();

const stores = [
  {
    name: 'Mussum Repairs',
    address: 'Alameda Jau',
    razaosocial: '1301',
    location: {
      type: 'Point',
      coordinates: ['-46.6623271', '-23.5617326'],
    },
    speciality: 'Tablet',
    cnpj: 'SP',
    phone: '01420-001',
  },
  {
    name: 'Mussum Fix',
    address: 'Av. Paulista',
    razaosocial: '2034',
    location: {
      type: 'Point',
      coordinates: ['-46.6615105', '-23.5585757'],
    },
    speciality: 'Mobile',
    cnpj: 'SP',
    phone: '01310-200',
  },
  {
    name: 'Mussum Repair',
    address: 'R. Augusta',
    razaosocial: '1856',
    location: {
      type: 'Point',
      coordinates: ['-46.6634952', '-23.558779'],
    },
    speciality: 'Laptop',
    cnpj: 'SP',
    phone: '01412-000',
  },
  {
    name: 'Mussum MasterBuilder',
    address: 'R. Pamplona',
    razaosocial: '734',
    location: {
      type: 'Point',
      coordinates: ['-46.6547006', '-23.5643488'],
    },
    speciality: 'Tablet',
    cnpj: 'SP',
    phone: '01405-001',
  },
  {
    name: 'Mussum Repair',
    address: 'Av. Goias',
    razaosocial: '1805',
    location: {
      type: 'Point',
      coordinates: ['-46.5581647', '-23.6163362'],
    },
    speciality: 'Console',
    cnpj: 'SP',
    phone: '09550-050',
  },
  {
    name: 'Mussum Fix It',
    address: 'R. Mal. Deodoro',
    razaosocial: '1332',
    location: {
      type: 'Point',
      coordinates: ['-46.6230304', '-23.6309083'],
    },
    speciality: "TV's",
    cnpj: 'SP',
    phone: '09710-002',
  },
  {
    name: 'Biritis faz tudo',
    address: 'R. Aurora Soares Barbosa',
    razaosocial: '775',
    location: {
      type: 'Point',
      coordinates: ['-46.7719213', '-23.5464799'],
    },
    speciality: "TV's",
    cnpj: 'SP',
    phone: '06032-010',
  },
  {
    name: 'FixITmussuM',
    address: 'R. Waldir de Azevedo',
    razaosocial: '20',
    location: {
      type: 'Point',
      coordinates: ['-46.7805996', '-23.5916636'],
    },
    speciality: "TV's",
    cnpj: 'SP',
    phone: '07122-170',
  },
  {
    name: 'Mussivis',
    address: 'R. Sebastião Pereira',
    razaosocial: '245',
    location: {
      type: 'Point',
      coordinates: ['-46.6490426', '-23.5396795'],
    },
    speciality: 'Audio',
    cnpj: 'SP',
    phone: '01225-020',
  },
  {
    name: 'MasterFix do Mussum',
    address: 'Av. Rui Barbosa',
    razaosocial: '409',
    location: {
      type: 'Point',
      coordinates: ['-46.644993', '-23.559155'],
    },
    speciality: 'Audio',
    cnpj: 'SP',
    phone: '06311-000',
  },
  {
    name: "Mussum'O'Matic",
    address: 'Av. Antonio Piranga',
    razaosocial: '171',
    location: {
      type: 'Point',
      coordinates: ['-46.622707', '-23.686251'],
    },
    speciality: 'Laptop',
    cnpj: 'SP',
    phone: '09911-160',
  },
  {
    name: 'Mussivis',
    address: 'Av. Vital Brasil',
    razaosocial: '1133',
    location: {
      type: 'Point',
      coordinates: ['-46.7151041', '-23.5694623'],
    },
    speciality: 'Laptop',
    cnpj: 'SP',
    phone: '05503-001',
  },
  {
    name: 'Murgusum',
    address: 'Av. Alcantara Machado',
    razaosocial: '576',
    location: {
      type: 'Point',
      coordinates: ['-46.6193709', '-23.5530546'],
    },
    speciality: 'Laptop',
    cnpj: 'SP',
    phone: '03102-000',
  },
  {
    name: 'Massivis Mussum',
    address: 'Av. Imirim',
    razaosocial: '1217',
    location: {
      type: 'Point',
      coordinates: ['-46.6462815', '-23.4944008'],
    },
    speciality: 'Mobile',
    cnpj: 'SP',
    phone: '02465-100',
  },
  {
    name: 'Sr Biritis',
    address: 'Av. Roque Petroni Junior',
    razaosocial: '1089',
    location: {
      type: 'Point',
      coordinates: ['-46.6980466', '-23.6215123'],
    },
    speciality: 'Mobile',
    cnpj: 'SP',
    phone: '04707-000',
  },
];


Stores.create(stores, (err) => {
  if (err) { throw (err) }
  console.log(`Created ${stores.length} entries in the stores database`);
  mongoose.connection.close();
});