var Ticket = /** @class */ (function () {
    function Ticket(moviename, showtime, seatnumber, bookeddatetime, totalmoney) {
        this.moviename = moviename;
        this.showtime = showtime;
        this.seatnumber = seatnumber;
        this.bookeddatetime = bookeddatetime;
        this.totalmoney = totalmoney;
        this.movieName = moviename;
        this.showTime = showtime;
        this.seatNumber = seatnumber;
        this.bookedDateTime = bookeddatetime;
        this.totalMoney = totalmoney;
    }
    Ticket.prototype.bookTicket = function () {
        if (selectedSeats.length != 0) {
            var isConfirm = confirm("Are you sure to book tickets!");
            if (isConfirm) {
                for (var _i = 0, selectedSeats_1 = selectedSeats; _i < selectedSeats_1.length; _i++) {
                    var seat = selectedSeats_1[_i];
                    seat.style.backgroundColor = 'red';
                    bookedSeats.push(seat);
                }
                selectedSeats = [];
                var ticket = {
                    MovieName: this.movieName,
                    ShowTime: this.showTime,
                    SeatsNumber: this.seatNumber,
                    BookedDatetime: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
                    TotalMoney: this.totalMoney.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').toString() + " vnd",
                    RemoveId: "ticket" + bookTickets.length
                };
                bookedTickets.push(ticket);
                this.createTableOfListBookedTickets(ticket);
                document.getElementById("booked-seats").innerHTML = "";
                document.getElementById("money-total").textContent = "0";
                moneyTotal = 0;
            }
        }
        else {
            alert("No seats selected!");
        }
    };
    Ticket.prototype.removeTicket = function (id) {
        ///
        var isConfirm = confirm("Are you sure to remove this ticket!");
        if (isConfirm) {
            var table = document.getElementById('list-booked-tickets');
            var rows = table.getElementsByTagName('tr');
            for (var i = 1; i < rows.length; i++) {
                if (rows[i].cells[5].firstElementChild.id === id) {
                    var timeBooked = rows[i].cells[3].childNodes[0].textContent;
                    var ticket;
                    for (var _i = 0, bookedTickets_1 = bookedTickets; _i < bookedTickets_1.length; _i++) {
                        var ticketItem = bookedTickets_1[_i];
                        if (ticketItem.BookedDatetime === timeBooked) {
                            ticket = ticketItem;
                            break;
                        }
                    }
                    var seats = ticket.SeatsNumber.split(" ");
                    for (var _a = 0, seats_1 = seats; _a < seats_1.length; _a++) {
                        var seat = seats_1[_a];
                        if (seat === "")
                            continue;
                        var seatIndex = bookedSeats.indexOf(findElementById(seats, seat));
                        bookedSeats.splice(seatIndex, 1);
                        var btn = document.getElementById(seat);
                        btn.style.backgroundColor = "#74e393";
                        freeSeats.push(btn);
                    }
                    table.deleteRow(i);
                    break;
                }
            }
            for (var i = 0; i < bookedTickets.length; i++) {
                var x = (bookedTickets[i]);
            }
        }
    };
    Ticket.prototype.createTableOfListBookedTickets = function (ticket) {
        var table = document.getElementById("list-booked-tickets");
        var row = table.insertRow();
        for (var element in ticket) {
            var cell = row.insertCell();
            if (element === "RemoveId") {
                var btnRemove = document.createElement("button");
                btnRemove.innerHTML = "x";
                btnRemove.style.border = "none";
                btnRemove.style.backgroundColor = "white";
                btnRemove.id = ticket[element];
                btnRemove.addEventListener('click', function () { new Ticket("", "", "", "", 2).removeTicket(btnRemove.id); }, false);
                cell.appendChild(btnRemove);
                break;
            }
            var text = document.createTextNode(ticket[element]);
            cell.appendChild(text);
        }
    };
    return Ticket;
}());
var Seat = /** @class */ (function () {
    function Seat() {
    }
    Seat.prototype.addSeatsNumber = function (seatArray) {
        for (var i = 'A'; i < 'J'; i = String.fromCharCode(i.charCodeAt(0) + 1)) {
            var x;
            for (var j = 1; j < 13; j++) {
                x = (i + j).toString();
                seatArray.push(x);
            }
        }
    };
    Seat.prototype.createSeats = function (seatArray) {
        var table = document.getElementById("seats");
        var row = table.insertRow();
        var count = 1;
        for (var _i = 0, seatArray_1 = seatArray; _i < seatArray_1.length; _i++) {
            var element = seatArray_1[_i];
            if (count == 13) {
                var row = table.insertRow();
                count = 1;
            }
            var cell = row.insertCell();
            var btnSeat = document.createElement("button");
            btnSeat.innerHTML = element;
            btnSeat.id = element;
            btnSeat.style.width = '100%';
            btnSeat.style.backgroundColor = '#74e393';
            btnSeat.style.border = 'none';
            btnSeat.addEventListener('click', function () { new Seat().changeSeats(event); }, false);
            cell.appendChild(btnSeat);
            freeSeats.push(btnSeat);
            count++;
        }
    };
    Seat.prototype.changeSeats = function (event) {
        var btnSeat = document.getElementById(event.target.id);
        var freeSeatIndex = freeSeats.indexOf(findElementById(freeSeats, btnSeat.id));
        var selectedSeatIndex = selectedSeats.indexOf(findElementById(selectedSeats, btnSeat.id));
        var textBoxBookedSeats = document.getElementById("booked-seats");
        if (freeSeatIndex != -1) {
            btnSeat.style.backgroundColor = "cyan";
            freeSeats.splice(freeSeatIndex, 1);
            selectedSeats.push(btnSeat);
            textBoxBookedSeats.innerHTML += (btnSeat.id + " ");
            moneyTotal += 45000;
            document.getElementById("money-total").textContent = moneyTotal.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').toString();
        }
        else if (selectedSeatIndex != -1) {
            btnSeat.style.backgroundColor = "#74e393";
            freeSeats.push(btnSeat);
            selectedSeats.splice(selectedSeatIndex, 1);
            var bookedSeatsName = textBoxBookedSeats.textContent;
            bookedSeatsName = bookedSeatsName.replace(btnSeat.id, "");
            textBoxBookedSeats.innerHTML = bookedSeatsName;
            moneyTotal -= 45000;
            document.getElementById("money-total").textContent = moneyTotal.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').toString();
        }
    };
    return Seat;
}());
var seats = [];
var freeSeats = [];
var bookedSeats = [];
var selectedSeats = [];
var moneyTotal = 0;
var bookedTickets = [];
function findElementById(arrays, id) {
    for (var _i = 0, arrays_1 = arrays; _i < arrays_1.length; _i++) {
        var element = arrays_1[_i];
        if (element.id === id) {
            return element;
        }
    }
}
var seat = new Seat();
seat.addSeatsNumber(seats);
seat.createSeats(seats);
function bookTickets() {
    var ticket = new Ticket(document.getElementById("movie-name").textContent.toString(), document.getElementById("show-time").textContent.toString(), document.getElementById("booked-seats").textContent.toString(), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), +document.getElementById("money-total").textContent.replace(",", ""));
    ticket.bookTicket();
}
