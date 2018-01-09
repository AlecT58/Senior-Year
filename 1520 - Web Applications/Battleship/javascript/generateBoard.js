let topTable = document.getElementById('topGrid').getElementsByTagName('tbody')[0];
let bottomTable = document.getElementById('bottomGrid').getElementsByTagName('tbody')[0];

for(var i = 0; i < 10; i++) {
  let newRowTop = topTable.insertRow(i);
  let newRowBottom = bottomTable.insertRow(i);

  for(var j = 0; j < 11; j++) {
    let cellTop = newRowTop.insertCell(j);
    let cellBottom = newRowBottom.insertCell(j);

    if(j == 0) {
      cellTop.innerText = i+1;
      cellBottom.innerText = i+1;
      cellTop.classList.add('board_labels');
      cellBottom.classList.add('board_labels');
    }
    else {
      cellTop.classList.add('grid_pieces');
      cellBottom.classList.add('grid_pieces');
      cellTop.addEventListener('click', cellClicked);
    }
  }
}

function cellClicked() {
  alert('You clicked cell ' + this.cellIndex + ' of row ' + this.parentNode.rowIndex);
  //function handle click here
}
