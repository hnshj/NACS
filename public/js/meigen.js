var random = Math.floor( Math.random() * 11 );
var meigen = "What's up?"

if (random == 0){
    meigen = "これは証明できねー";
    meigen.innerHTML = "これは証明できねー";
} else if (random == 1){
    meigen = "学問ってのはなー、生きざまなんだよ"
    meigen.innerHTML = "学問ってのはなー、生きざまなんだよ";
} else if (random == 2){
    meigen = "お前ほんと、とろくさいなー"
    meigen.innerHTML = "お前ほんと、とろくさいなー";
} else {
    meigen = "Stay hungry, Stay foolish."
    meigen.innerHTML = "Stay hungry, Stay foolish."
}

console.log(random);
console.log(meigen);