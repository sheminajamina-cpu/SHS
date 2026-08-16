// ==========================================
// COLLEGE ATTENDANCE SYSTEM
// ==========================================


// ==========================================
// STUDENT DATA
// ==========================================

const students = [

    {
        id: 1,
        name: "Jami",
        department: "BME",
        section: "A"
    },

    {
        id: 2,
        name: "Gokul",
        department: "AIDS",
        section: "A"
    },

    {
        id: 3,
        name: "Anu",
        department: "IT",
        section: "B"
    },

    {
        id: 4,
        name: "Bavana",
        department: "ECE",
        section: "A"
    },

    {
        id: 5,
        name: "Dhjjj",
        department: "CSE",
        section: "B"
    }

];


// ==========================================
// GET ELEMENTS
// ==========================================

const departmentFilter =
    document.getElementById(
        "departmentFilter"
    );

const sectionFilter =
    document.getElementById(
        "sectionFilter"
    );

const studentFilter =
    document.getElementById(
        "studentFilter"
    );

const attendanceTable =
    document.getElementById(
        "attendanceTable"
    );

const futureGrid =
    document.getElementById(
        "futureGrid"
    );


// ==========================================
// LOCAL STORAGE
// ==========================================

let attendance =
    JSON.parse(
        localStorage.getItem(
            "collegeAttendance"
        )
    ) || {};


// ==========================================
// DATE FUNCTION
// ==========================================

function getLocalDate(daysFromToday = 0) {

    const date = new Date();

    date.setHours(
        12,
        0,
        0,
        0
    );

    date.setDate(
        date.getDate() +
        daysFromToday
    );

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// ==========================================
// DISPLAY DATE
// ==========================================

function displayDate(dateString) {

    const parts =
        dateString.split("-");

    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// PREVIOUS 15 DAYS
// ==========================================

function getPrevious15Days() {

    const dates = [];

    for (
        let i = -15;
        i <= -1;
        i++
    ) {

        dates.push(
            getLocalDate(i)
        );

    }

    return dates;

}


// ==========================================
// NEXT 15 DAYS
// ==========================================

function getNext15Days() {

    const dates = [];

    for (
        let i = 1;
        i <= 15;
        i++
    ) {

        dates.push(
            getLocalDate(i)
        );

    }

    return dates;

}


// ==========================================
// SAVE DATA
// ==========================================

function saveAttendance() {

    localStorage.setItem(
        "collegeAttendance",
        JSON.stringify(attendance)
    );

}


// ==========================================
// FILTER STUDENTS
// ==========================================

function getFilteredStudents() {

    const department =
        departmentFilter.value;

    const section =
        sectionFilter.value;

    const selectedStudent =
        studentFilter.value;


    return students.filter(
        student => {

            const departmentMatch =
                department === "all" ||
                student.department ===
                department;


            const sectionMatch =
                section === "all" ||
                student.section ===
                section;


            const studentMatch =
                selectedStudent ===
                "all" ||
                String(student.id) ===
                selectedStudent;


            return (
                departmentMatch &&
                sectionMatch &&
                studentMatch
            );

        }
    );

}


// ==========================================
// POPULATE STUDENT FILTER
// ==========================================

function populateStudents() {

    const oldValue =
        studentFilter.value;


    studentFilter.innerHTML = `
        <option value="all">
            All Students
        </option>
    `;


    const filtered =
        students.filter(
            student => {

                const departmentMatch =
                    departmentFilter.value ===
                    "all" ||
                    student.department ===
                    departmentFilter.value;


                const sectionMatch =
                    sectionFilter.value ===
                    "all" ||
                    student.section ===
                    sectionFilter.value;


                return (
                    departmentMatch &&
                    sectionMatch
                );

            }
        );


    filtered.forEach(
        student => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                student.id;

            option.textContent =
                `${student.name} - ${student.department}`;

            studentFilter.appendChild(
                option
            );

        }
    );


    if (
        [...studentFilter.options]
            .some(
                option =>
                    option.value ===
                    oldValue
            )
    ) {

        studentFilter.value =
            oldValue;

    }

}


// ==========================================
// ATTENDANCE KEY
// ==========================================

function getKey(
    studentId,
    date
) {

    return `${studentId}_${date}`;

}


// ==========================================
// MARK ATTENDANCE
// ==========================================

function markAttendance(
    studentId,
    date,
    status
) {

    const key =
        getKey(
            studentId,
            date
        );


    attendance[key] =
        status;


    saveAttendance();

    renderTable();

    updateStatistics();

    renderFutureDays();

}


// ==========================================
// GET STATUS
// ==========================================

function getStatus(
    studentId,
    date
) {

    return attendance[
        getKey(
            studentId,
            date
        )
    ] || null;

}


// ==========================================
// CALCULATE STUDENT %
// ==========================================

function calculatePercentage(
    studentId
) {

    const dates =
        getPrevious15Days();


    let present = 0;

    let marked = 0;


    dates.forEach(
        date => {

            const status =
                getStatus(
                    studentId,
                    date
                );


            if (status) {

                marked++;

                if (
                    status ===
                    "present"
                ) {

                    present++;

                }

            }

        }
    );


    if (marked === 0) {

        return 0;

    }


    return Math.round(
        (
            present /
            marked
        ) * 100
    );

}


// ==========================================
// RENDER TABLE
// ==========================================

function renderTable() {

    attendanceTable.innerHTML =
        "";


    const filteredStudents =
        getFilteredStudents();


    const dates =
        getPrevious15Days();


    if (
        filteredStudents.length ===
        0
    ) {

        attendanceTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;padding:30px">

                    No students found

                </td>

            </tr>

        `;

        return;

    }


    filteredStudents.forEach(
        student => {

            dates.forEach(
                date => {

                    const status =
                        getStatus(
                            student.id,
                            date
                        );


                    const percentage =
                        calculatePercentage(
                            student.id
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            <strong>
                                ${student.name}
                            </strong>
                        </td>

                        <td>
                            ${student.department}
                        </td>

                        <td>
                            ${student.section}
                        </td>

                        <td>
                            ${displayDate(date)}
                        </td>

                        <td>

                            <div
                                class="status-buttons">

                                <button
                                    class="
                                        status-btn
                                        present
                                        ${status ===
                                        "present"
                                            ? "active"
                                            : ""}
                                    "
                                    onclick="
                                        markAttendance(
                                            ${student.id},
                                            '${date}',
                                            'present'
                                        )
                                    "
                                >
                                    ✓ Present
                                </button>


                                <button
                                    class="
                                        status-btn
                                        absent
                                        ${status ===
                                        "absent"
                                            ? "active"
                                            : ""}
                                    "
                                    onclick="
                                        markAttendance(
                                            ${student.id},
                                            '${date}',
                                            'absent'
                                        )
                                    "
                                >
                                    ✕ Absent
                                </button>


                                ${
                                    !status
                                    ? `
                                        <span
                                            class="not-marked">
                                            Not marked
                                        </span>
                                      `
                                    : ""
                                }

                            </div>

                        </td>

                        <td
                            class="percentage">

                            ${percentage}%

                        </td>

                    `;


                    attendanceTable.appendChild(
                        row
                    );

                }
            );

        }
    );

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const today =
        getLocalDate(0);


    const filteredStudents =
        getFilteredStudents();


    let presentToday = 0;

    let absentToday = 0;


    filteredStudents.forEach(
        student => {

            const status =
                getStatus(
                    student.id,
                    today
                );


            if (
                status ===
                "present"
            ) {

                presentToday++;

            }


            if (
                status ===
                "absent"
            ) {

                absentToday++;

            }

        }
    );


    document.getElementById(
        "totalStudents"
    ).textContent =
        filteredStudents.length;


    document.getElementById(
        "presentToday"
    ).textContent =
        presentToday;


    document.getElementById(
        "absentToday"
    ).textContent =
        absentToday;


    let totalPercentage = 0;


    filteredStudents.forEach(
        student => {

            totalPercentage +=
                calculatePercentage(
                    student.id
                );

        }
    );


    const average =
        filteredStudents.length
            ? Math.round(
                totalPercentage /
                filteredStudents.length
            )
            : 0;


    document.getElementById(
        "averageAttendance"
    ).textContent =
        `${average}%`;

}


// ==========================================
// DATE RANGE
// ==========================================

function updateDateRange() {

    const previous =
        getPrevious15Days();

    const next =
        getNext15Days();


    document.getElementById(
        "todayDate"
    ).textContent =
        displayDate(
            getLocalDate()
        );


    document.getElementById(
        "previousRange"
    ).textContent =
        `${displayDate(previous[0])}
         - ${displayDate(previous[14])}`;


    document.getElementById(
        "nextRange"
    ).textContent =
        `${displayDate(next[0])}
         - ${displayDate(next[14])}`;

}


// ==========================================
// FUTURE 15 DAYS
// ==========================================

function renderFutureDays() {

    futureGrid.innerHTML =
        "";


    const dates =
        getNext15Days();


    dates.forEach(
        date => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "future-day";


            const filteredStudents =
                getFilteredStudents();


            let present = 0;

            let absent = 0;


            filteredStudents.forEach(
                student => {

                    const status =
                        getStatus(
                            student.id,
                            date
                        );


                    if (
                        status ===
                        "present"
                    ) {

                        present++;

                    }


                    if (
                        status ===
                        "absent"
                    ) {

                        absent++;

                    }

                }
            );


            const marked =
                present +
                absent;


            card.innerHTML = `

                <strong>
                    ${displayDate(date)}
                </strong>

                <small>
                    Future Attendance
                </small>

                <div class="future-status">

                    ${
                        marked === 0

                        ? "Not marked yet"

                        : `
                            ✓ Present: ${present}
                            <br>
                            ✕ Absent: ${absent}
                          `
                    }

                </div>

            `;


            futureGrid.appendChild(
                card
            );

        }
    );

}


// ==========================================
// CLEAR ATTENDANCE
// ==========================================

function clearAllAttendance() {

    const confirmed =
        confirm(
            "Are you sure you want to clear all attendance?"
        );


    if (!confirmed) {

        return;

    }


    attendance = {};


    saveAttendance();

    renderTable();

    updateStatistics();

    renderFutureDays();

}


// ==========================================
// FILTER EVENTS
// ==========================================

departmentFilter.addEventListener(
    "change",
    () => {

        populateStudents();

        renderTable();

        updateStatistics();

        renderFutureDays();

    }
);


sectionFilter.addEventListener(
    "change",
    () => {

        populateStudents();

        renderTable();

        updateStatistics();

        renderFutureDays();

    }
);


studentFilter.addEventListener(
    "change",
    () => {

        renderTable();

        updateStatistics();

        renderFutureDays();

    }
);


// ==========================================
// START
// ==========================================

populateStudents();

updateDateRange();

renderTable();

updateStatistics();

renderFutureDays();
