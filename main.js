function check_win(args) {
    const sortedArray = [...values_cell_from_start_to_last].sort((a, b) => a - b);
    return args.every((value, index) => value === sortedArray[index]);
}



function from_1_to_16_unique_random(length) {
    const value_array = Array.from({ length: length }, (_, index) => index + 1);
    for (let i = value_array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [value_array[i], value_array[j]] = [value_array[j], value_array[i]];
    }
    return value_array;
}

let values_cell_from_start_to_last = from_1_to_16_unique_random(16);
let count_rows = 4;
let count_changes = 0;
let time_count = new Date();


function update_cell_values() {
    let cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = values_cell_from_start_to_last[i];
        if (values_cell_from_start_to_last[i] === 16) {
            cells[i].style.visibility = 'hidden';
        } else {
            cells[i].style.visibility = 'visible';
        }
    }
}




function swap(ID) {
    let current = ID - 1;

    let cells_which_can_change = [
        current - 1,
        current + 1,
        current - count_rows,
        current + count_rows
    ];



    if (cells_which_can_change.some(index => values_cell_from_start_to_last[index] === 16)) {
        for (let i = 0; i < cells_which_can_change.length; i++) {
            if (values_cell_from_start_to_last[cells_which_can_change[i]] === 16) {
                let temp = values_cell_from_start_to_last[current];
                values_cell_from_start_to_last[current] = values_cell_from_start_to_last[cells_which_can_change[i]];
                values_cell_from_start_to_last[cells_which_can_change[i]] = temp;
                count_changes++;
                update_cell_values();
                if (check_win(values_cell_from_start_to_last)) {
                    alert("Вы победили!" + " " + (new Date() - time_count) / 1000 + " " + count_changes);
                    count_changes = 0;
                    time_count = new Date();
                }
                break;
            }
        }
    }
}
function arrows_pressed(key) {
    let index_16 = values_cell_from_start_to_last.indexOf(16);
    let i_16 = Math.floor(index_16 / count_rows);
    let j_16 = index_16 % count_rows;
    let need_row = i_16;
    let need_column = j_16;
    switch (key) {
        case 'ArrowUp':
            need_row++;
            break;
        case 'ArrowDown':
            need_row--;
            break;
        case 'ArrowLeft':
            need_column++;
            break;
        case 'ArrowRight':
            need_column--;
            break;
        default:
            return;
    }

    if (need_row >= 0 && need_row < count_rows && need_column >= 0 && need_column < count_rows) {
        let targetIndex = need_row * count_rows + need_column;
        let temp = values_cell_from_start_to_last[index_16];
        values_cell_from_start_to_last[index_16] = values_cell_from_start_to_last[targetIndex];
        values_cell_from_start_to_last[targetIndex] = temp;
        count_changes++;
        update_cell_values();
        if (check_win(values_cell_from_start_to_last)) {
            alert("Вы победили!" + " " + (new Date() - time_count) / 1000 + " " + count_changes);
            count_changes = 0;
            time_count = new Date();
        }
    }
}

function keyPressHandler(event) {
    let key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        arrows_pressed(key);
    }
}

document.addEventListener('keydown', keyPressHandler);



update_cell_values();


document.addEventListener('DOMContentLoaded', function() {
    const contextMenu = document.getElementById('contextMenu');

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        showContextMenu(x, y);
    });

    document.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    });

    function showContextMenu(x, y) {
        contextMenu.style.display = 'block';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
    }

    const formOption = document.getElementById('form');
    const colorOption = document.getElementById('color');
    const bgOption = document.getElementById('bg');

    formOption.addEventListener('click', function() {
        let cells = document.getElementsByClassName("cell");
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.borderRadius = '50%';
        }
    });
    
    colorOption.addEventListener('click', function() {
        let cells = document.getElementsByClassName("cell");
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.border = '3px solid rgba(255, 255, 255, 1)';
        }
    });
    
    bgOption.addEventListener('click', function() {
        document.body.style.backgroundImage = 'url("backneon1.jpg")';
        let cells = document.getElementsByClassName("cell");
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'transparent';
            cells[i].style.color = 'white';

        }


    });
    
});
