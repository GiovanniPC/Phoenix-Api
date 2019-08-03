const speciality = {Tablet: true, Mobile:false, Laptop:true, Consoles: false, TV: true, Audio: false}
const newSpeciality = [];
for(key in speciality){
   if(speciality[key])  newSpeciality.push(key)  
}

console.log(newSpeciality);