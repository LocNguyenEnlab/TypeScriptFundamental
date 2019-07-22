var TicketModel = /** @class */ (function () {
    function TicketModel() {
    }
    return TicketModel;
}());
var SeatModel = /** @class */ (function () {
    function SeatModel() {
    }
    return SeatModel;
}());
var TicketService = /** @class */ (function () {
    function TicketService() {
    }
    TicketService.prototype.bookTicket = function (ticket) {
        if (seats.filter(function (s) { return s.status === 'Selected'; })[0]) {
            var isConfirm = confirm("Are you sure to book tickets!");
            if (isConfirm) {
                for (var _i = 0, seats_1 = seats; _i < seats_1.length; _i++) {
                    var seat = seats_1[_i];
                    if (seat.status === 'Selected') {
                        document.getElementById(seat.name).style.backgroundColor = 'red';
                        seat.status = 'Booked';
                    }
                }
                ticket.totalMoney = ticket.totalMoney.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').toString() + " vnd";
                ticket.removeTicketId = "ticket" + bookedTickets.length;
                bookedTickets.push(ticket);
                this.createTableOfBookedTicketsList(ticket);
                document.getElementById("booked-seats").innerHTML = "";
                document.getElementById("money-total").textContent = "0";
                moneyTotal = 0;
            }
        }
        else {
            alert("No seats selected!");
        }
    };
    TicketService.prototype.removeTicket = function (removeTicketId) {
        var isConfirm = confirm("Are you sure to remove this ticket!");
        if (isConfirm) {
            var table = document.getElementById('list-booked-tickets');
            var rows = table.getElementsByTagName('tr');
            for (var i = 1; i < rows.length; i++) {
                if (rows[i].cells[5].firstElementChild.id === removeTicketId) {
                    var ticket;
                    for (var _i = 0, bookedTickets_1 = bookedTickets; _i < bookedTickets_1.length; _i++) {
                        var ticketItem = bookedTickets_1[_i];
                        if (ticketItem.removeTicketId === removeTicketId) {
                            ticket = ticketItem;
                            break;
                        }
                    }
                    var seatsName = ticket.seatNumber.split(" ");
                    for (var _a = 0, seatsName_1 = seatsName; _a < seatsName_1.length; _a++) {
                        var seatName = seatsName_1[_a];
                        if (seatName === "")
                            continue;
                        seats.filter(function (s) { return s.name === seatName; })[0].status = 'Available';
                        var btn = document.getElementById(seatName);
                        btn.style.backgroundColor = "#74e393";
                    }
                    table.deleteRow(i);
                    break;
                }
            }
        }
    };
    TicketService.prototype.createTableOfBookedTicketsList = function (ticket) {
        var table = document.getElementById("list-booked-tickets");
        var row = table.insertRow();
        for (var element in ticket) {
            var cell = row.insertCell();
            if (element === "removeTicketId") {
                var btnRemove = document.createElement("button");
                btnRemove.innerHTML = "x";
                btnRemove.style.border = "none";
                btnRemove.style.backgroundColor = "white";
                btnRemove.id = ticket[element];
                btnRemove.addEventListener('click', function () { new TicketService().removeTicket(btnRemove.id); }, false);
                cell.appendChild(btnRemove);
                break;
            }
            var text = document.createTextNode(ticket[element]);
            cell.appendChild(text);
        }
    };
    return TicketService;
}());
var SeatService = /** @class */ (function () {
    function SeatService() {
    }
    SeatService.prototype.addSeatsNumber = function () {
        for (var i = 'A'; i < 'J'; i = String.fromCharCode(i.charCodeAt(0) + 1)) {
            for (var j = 1; j < 13; j++) {
                var tempSeat = {
                    name: (i + j).toString(),
                    status: 'Available'
                };
                seats.push(tempSeat);
            }
        }
    };
    SeatService.prototype.createSeats = function () {
        var table = document.getElementById("seats");
        var row = table.insertRow();
        var count = 1;
        for (var _i = 0, seats_2 = seats; _i < seats_2.length; _i++) {
            var element = seats_2[_i];
            if (count === 13) {
                var row = table.insertRow();
                count = 1;
            }
            var cell = row.insertCell();
            var btnSeat = document.createElement("button");
            btnSeat.innerHTML = element.name;
            btnSeat.id = element.name;
            btnSeat.style.width = '100%';
            btnSeat.style.backgroundColor = '#74e393';
            btnSeat.style.border = 'none';
            btnSeat.addEventListener('click', function () { new SeatService().changeSeats(event); }, false);
            cell.appendChild(btnSeat);
            count++;
        }
    };
    SeatService.prototype.changeSeats = function (event) {
        var btnSeat = document.getElementById(event.target.id);
        var seat = seats.filter(function (s) { return s.name === event.target.id; })[0];
        var textBoxBookedSeats = document.getElementById("booked-seats");
        if (seat.status === 'Available') {
            btnSeat.style.backgroundColor = "cyan";
            seat.status = 'Selected';
            textBoxBookedSeats.innerHTML += (btnSeat.id + " ");
            moneyTotal += 45000;
            document.getElementById("money-total").textContent = moneyTotal.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').toString();
        }
        else if (seat.status === 'Selected') {
            btnSeat.style.backgroundColor = "#74e393";
            seat.status = 'Available';
            var bookedSeatsName = textBoxBookedSeats.textContent;
            bookedSeatsName = bookedSeatsName.replace(btnSeat.id, "");
            textBoxBookedSeats.innerHTML = bookedSeatsName;
            moneyTotal -= 45000;
            document.getElementById("money-total").textContent = moneyTotal.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').toString();
        }
    };
    return SeatService;
}());
var seats = [];
var moneyTotal = 0;
var bookedTickets = [];
var seatService = new SeatService();
var ticketService = new TicketService();
seatService.addSeatsNumber();
seatService.createSeats();
function bookTickets() {
    var ticket = {
        movieName: document.getElementById("movie-name").textContent.toString(),
        showTime: document.getElementById("show-time").textContent.toString(),
        seatNumber: document.getElementById("booked-seats").textContent.toString(),
        bookedDateTime: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
        totalMoney: +document.getElementById("money-total").textContent.replace(",", ""),
        removeTicketId: ''
    };
    ticketService.bookTicket(ticket);
}
