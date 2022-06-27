// Ran in JS console when the versions dropdown is open at
// https://www.planetminecraft.com/texture-packs/?op1=any

lookupSource = [];
lookupDest = [];

for (
  var i = 0;
  i <
  document
    .getElementsByClassName("submenu currently_open")[0]
    .getElementsByTagName("li").length;
  i++
) {
  let name = document
    .getElementsByClassName("submenu currently_open")[0]
    .getElementsByTagName("li")
    [i].getElementsByTagName("a")[0]
    .innerHTML.split("<")[0]
    .replaceAll("Minecraft ", "")
    .split("");

  name.pop();
  name = name.join("");

  let value = document
    .getElementsByClassName("submenu currently_open")[0]
    .getElementsByTagName("li")
    [i].getElementsByTagName("a")[0].href;

  lookupDest.push(value);
  
  if (name == "All Game Version") {
    lookupSource.push("All");
    continue;
  }

  lookupSource.push(name);
}

console.log(lookupSource);
console.log(lookupDest);
