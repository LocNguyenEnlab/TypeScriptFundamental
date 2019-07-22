class TicketModel {
    movieName: string;
    showTime: string;
    seatNumber: string;
    bookedDateTime: string;
    totalMoney: number;
    removeTicketId: string;
}

class SeatModel {
    name: string;
    status: string;
}

class TicketService {
    bookTicket(ticket) : void {
        if (seats.filter(s => s.status === 'Selected')[0]) {
            var isConfirm = confirm("Are you sure to book tickets!");
            if (isConfirm) {
                for (var seat of seats) {
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
    }

    removeTicket(removeTicketId:string) : void {
        var isConfirm = confirm("Are you sure to remove this ticket!");
        if (isConfirm) {
            var table:HTMLTableElement = <HTMLTableElement> document.getElementById('list-booked-tickets');
            var rows = table.getElementsByTagName('tr');
            for (var i = 1; i < rows.length; i++) {
                if (rows[i].cells[5].firstElementChild.id === removeTicketId) {
                    
                    var ticket: TicketModel;

                    for (var ticketItem of bookedTickets) {
                        if (ticketItem.removeTicketId === removeTicketId){
                            ticket = ticketItem;
                            break;
                        }
                    }

                    var seatsName = ticket.seatNumber.split(" ");
                    for (var seatName of seatsName) {
                        if (seatName === "")
                            continue;
                        seats.filter(s => s.name === seatName)[0].status = 'Available';
                        var btn = document.getElementById(seatName);
                        btn.style.backgroundColor = "#74e393";
                    }
                    table.deleteRow(i);            
                    break;
                }
            }
        }
    }

    createTableOfBookedTicketsList(ticket) : void {
        var table: HTMLTableElement = <HTMLTableElement> document.getElementById("list-booked-tickets");
        var row = table.insertRow();    
        for (var element in ticket) {
            var cell = row.insertCell();        
            if (element === "removeTicketId") {
                var btnRemove = document.createElement("button");
                btnRemove.innerHTML = "x";
                btnRemove.style.border = "none";
                btnRemove.style.backgroundColor = "white";
                btnRemove.id = ticket[element];                
                btnRemove.addEventListener('click', function() {new TicketService().removeTicket(btnRemove.id)}, false);
                cell.appendChild(btnRemove);
                break;
            }
            var text = document.createTextNode(ticket[element]);
            cell.appendChild(text);        
        }
    }
}

class SeatService {

    addSeatsNumber() : void {
        for (var i = 'A'; i < 'J'; i = String.fromCharCode(i.charCodeAt(0) + 1)) {
            for (var j = 1; j < 13; j++) {
                var tempSeat: SeatModel= {
                    name: (i+j).toString(),
                    status: 'Available',
                };
                seats.push(tempSeat);
            }
        }        
    }

    createSeats() : void {
        var table: HTMLTableElement = <HTMLTableElement> document.getElementById("seats");
        var row = table.insertRow();
        var count = 1;
        for (var element of seats) {
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
            btnSeat.addEventListener('click', function() {new SeatService().changeSeats(event)}, false);
            cell.appendChild(btnSeat);
            count++;
        }
    }

    changeSeats(event) : void {
        var btnSeat:HTMLElement = <HTMLElement> document.getElementById(event.target.id);
        var seat = seats.filter(s => s.name === event.target.id)[0];
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
    }
}

var seats = [];
var moneyTotal = 0;
var bookedTickets = [];

var seatService = new SeatService();
var ticketService = new TicketService();

seatService.addSeatsNumber();
seatService.createSeats();

function bookTickets() {
    var ticket: TicketModel = {
        movieName: document.getElementById("movie-name").textContent.toString(), 
        showTime: document.getElementById("show-time").textContent.toString(),
        seatNumber: document.getElementById("booked-seats").textContent.toString(),
        bookedDateTime: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
        totalMoney: +document.getElementById("money-total").textContent.replace(",", ""),
        removeTicketId: '',
    };    
    ticketService.bookTicket(ticket);    
}
