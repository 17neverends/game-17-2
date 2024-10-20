let timerInterval;
let startTime;
let name = "Василевс";
const tg_id = 12345;


function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const timeDiff = (currentTime - startTime) / 1000;
    const minutes = Math.floor(timeDiff / 60);
    const seconds = Math.floor(timeDiff % 60);
    document.getElementById('timer').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '00:00';
}

document.getElementById('restart-button').onclick = function() {
    values_cell_from_start_to_last = from_1_to_16_unique_random(16);
    count_changes = 0;
    time_count = new Date();
    update_cell_values();
    resetTimer();
    startTimer();
};


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
        cells[i].style.visibility = values_cell_from_start_to_last[i] === 16 ? 'hidden' : 'visible';
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
                checkForWin();
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
        checkForWin();
    }
}

function checkForWin() {
    if (check_win(values_cell_from_start_to_last)) {
        sendResult(tg_id, (new Date() - time_count) / 1000);
        showModal();
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

function showModal() {
    const modal = document.getElementById('modal');
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.innerText = `Вы победили! Время: ${(new Date() - time_count) / 1000} секунд, количество ходов: ${count_changes}`;
    modal.style.display = "block";
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('modal').style.display = "none";
}

document.getElementById('newGameButton').onclick = function() {
    values_cell_from_start_to_last = from_1_to_16_unique_random(16);
    count_changes = 0;
    time_count = new Date();
    update_cell_values();
    document.getElementById('modal').style.display = "none";
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('popup').style.display = "block";
});

const leaderboardData = {
    "leaders": [
        { "position": 1, "name": "Петр", "score": 1000, "tg_id": 67890 },
        { "position": 2, "name": "Алексей", "score": 950, "tg_id": 54321 },
        { "position": 3, "name": "Иван", "score": 900, "tg_id": 12345 }
    ]
};

document.getElementById('start-game-button').onclick = function() {
    document.getElementById('popup').style.display = "none";
    values_cell_from_start_to_last = from_1_to_16_unique_random(16);
    count_changes = 0;
    time_count = new Date();
    update_cell_values();
    startTimer();
};

function sendResult(tg_id, time) {
    fetch('http://localhost:8000/stat/send_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tg_id: tg_id,
            time: time
        })
    })
}


function renderLeaderboard(data) {
    document.getElementById('player-name').textContent = name;

    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';

    data.leaders.forEach(leader => {
        const leaderRow = document.createElement('div');
        leaderRow.classList.add('leader-row');

        let icon;
        if (leader.position === 1) {
            icon = '<img src="static/first.png" alt="Gold Medal" class="leader-icon">';
        } else if (leader.position === 2) {
            icon = '<img src="static/second.png" alt="Silver Medal" class="leader-icon">';
        } else if (leader.position === 3) {
            icon = '<img src="static/third.png" alt="Bronze Medal" class="leader-icon">';
        } else {
            icon = `<span class="leader-number">${leader.position}</span>`;
        }

        leaderRow.innerHTML = `
        ${icon}
        <span class="leader-name">
            ${leader.tg_id === tg_id ? '<strong>' : ''}${leader.name} - ${leader.score} очков${leader.tg_id === tg_id ? '</strong>' : ''}
        </span>
        `;

        leaderboardElement.appendChild(leaderRow);
    });

    document.getElementById('popup').style.display = 'block';
}


renderLeaderboard(leaderboardData);
