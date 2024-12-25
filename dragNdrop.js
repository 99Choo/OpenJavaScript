let draggingMenu = null;    // 현재 드래그 중인 메뉴를 저장하기 위한 변수
let dragOverBox = null;     // 드래그 오버 중인 박스를 저장하기 위한 변수
let totalAmount = 0;        // 총액을 계산하고 저장하기 위한 변수

function updateTotal() {
    totalAmount = 0;        // 총액 변수를 초기화.
    const cartItems = document.querySelectorAll('#boxCart .menu'); // 장바구니 안에 있는 모든 메뉴 요소를 선택.

    // 각 메뉴의 소계를 반복적으로 합산.
    cartItems.forEach(item => {
        const subtotal = parseFloat(item.dataset.subtotal); // 각 메뉴의 소계를 숫자로 변환.
        if (!isNaN(subtotal)) {                             // 소계가 유효한 숫자인 경우
            totalAmount += subtotal;                        // 총액에 소계를 더함.
        }
    });
    document.getElementById('totalDisplay').innerText = `총액: ${totalAmount.toFixed(0)}원`; // 화면에 총액을 업데이트.
}

function onDragStartMenu(event) {
    draggingMenu = this;                // 드래그가 시작된 메뉴 요소를 `draggingMenu` 변수에 저장.
    this.classList.add("draggingMenu"); // 드래그 상태를 나타내기 위해 "draggingMenu" 클래스를 메뉴 요소에 추가.
}

function onDragEndMenu(event) {
    draggingMenu = null;                        // 드래그가 끝났으므로 `draggingMenu` 변수를 초기화.
    this.classList.remove("draggingMenu");      // 드래그 상태를 나타내는 "draggingMenu" 클래스를 메뉴 요소에서 제거.
    if (dragOverBox) {
        dragOverBox.classList.remove("overBox"); // 드래그 오버 상태를 나타내는 "overBox" 클래스를 드롭 대상 박스에서 제거.
    }
}

function onDragOverBox(event) {
    event.preventDefault();                     // 드래그 이벤트의 기본 동작(예: 파일 열기)을 방지.
    dragOverBox = this;                         // 현재 드래그 오버된 박스 요소를 `dragOverBox` 변수에 저장.
    this.classList.add("overBox");              // 드래그 오버 상태를 나타내기 위해 "overBox" 클래스를 박스 요소에 추가.
}

function onDragLeaveBox(event) {
    dragOverBox = null;                         // 드래그가 박스 영역을 떠났으므로 `dragOverBox` 변수를 초기화.
    this.classList.remove("overBox");           // 드래그 오버 상태를 나타내는 "overBox" 클래스를 박스 요소에서 제거.
}

function onDropBox(event) {
    event.preventDefault();                     // 기본 드롭 동작(예: 브라우저가 파일을 열거나 이동하는 동작)을 방지.
    this.appendChild(draggingMenu);             // 현재 드롭된 박스(`this`)에 드래그 중인 메뉴 요소를 추가.

    if (this.id === 'boxCart') {                // 드래그된 메뉴가 카트로 이동했을 경우
        // 수량 조정 UI가 없을 경우 새로 생성
        if (!draggingMenu.querySelector('.quantity-wrapper')) {
            const quantityWrapper = document.createElement('div');
            quantityWrapper.className = 'quantity-wrapper';             // 수량 조정을 위한 래퍼 요소 생성


            const decrementButton = document.createElement('button');
            decrementButton.className = 'decrement-button';             // 수량 감소 버튼 생성
            decrementButton.innerText = '-';                            // 수량 감소 버튼에 "-" 텍스트 설정

            const incrementButton = document.createElement('button');
            incrementButton.className = 'increment-button';             // 수량 증가 버튼 생성
            incrementButton.innerText = '+';                            // 수량 증가 버튼에 "+" 텍스트 설정

            const quantityDisplay = document.createElement('span');
            quantityDisplay.className = 'quantity';                     // 수량 표시를 위한 요소 생성
            quantityDisplay.innerText = '1';                            // 초기 수량을 1로 설정
            
            // 수량 조정 UI를 래퍼에 추가
            quantityWrapper.appendChild(decrementButton); // 수량 감소 버튼을 수량 조정 래퍼에 추가
            quantityWrapper.appendChild(quantityDisplay); // 현재 수량을 표시하는 요소를 수량 조정 래퍼에 추가
            quantityWrapper.appendChild(incrementButton); // 수량 증가 버튼을 수량 조정 래퍼에 추가

            // 수량 조정 UI를 메뉴 요소에 추가
            draggingMenu.appendChild(quantityWrapper);

            const subtotalDisplay = document.createElement('div');
            subtotalDisplay.className = 'subtotal';                              // 소계 표시를 위한 요소 생성
            draggingMenu.dataset.price = parseFloat(draggingMenu.dataset.price); // 단가 설정
            draggingMenu.dataset.quantity = 1;                                   // 초기 수량 설정
            draggingMenu.dataset.subtotal = draggingMenu.dataset.price;          // 초기 소계 설정
            subtotalDisplay.innerText = `${draggingMenu.dataset.price}원`;       // 소계 텍스트 설정
            draggingMenu.appendChild(subtotalDisplay);
        } else {
            // 기존 UI 복구 (이미 추가된 메뉴)
            draggingMenu.dataset.quantity = 1;                                                     //수량을 1로 재설정
            draggingMenu.dataset.subtotal = draggingMenu.dataset.price;                            // 소계를 단가로 재설정
            draggingMenu.querySelector('.quantity').innerText = '1';                               // 수량 표시를 1로 업데이트
            draggingMenu.querySelector('.subtotal').innerText = `${draggingMenu.dataset.price}원`; // 소계 텍스트를 업데이트
        }

        updateTotal(); // 총액 업데이트
    } else if (this.id === 'boxMenu') {                             // 드래그된 메뉴가 메뉴 영역으로 돌아갔을 경우
        
        draggingMenu.dataset.quantity = 0;                          // 수량 초기화
        draggingMenu.dataset.subtotal = 0;                          // 소계 초기화
        draggingMenu.querySelector('.quantity-wrapper')?.remove();  // 수량 조정 UI 제거
        draggingMenu.querySelector('.subtotal')?.remove();          // 소계 표시 요소 제거거
        updateTotal();                                              // 총액 업데이트
    }
}


document.addEventListener('click', function(event) {                                                // 이벤트 위임: 증감 버튼 클릭 처리
    if (event.target.classList.contains('decrement-button')) {                                      // 수량 감소 버튼 클릭 시
        const menuItem = event.target.closest('.menu');                                             // 클릭된 버튼이 속한 메뉴 요소를 가져옴
        let quantity = parseInt(menuItem.dataset.quantity);                                         // 현재 수량을 정수로 변환하여 가져옴.
        if (quantity > 1) {                                                                         // 수량이 1보다 클 때만 감소 가능.
            quantity -= 1;                                                                          // 수량을 1 감소.
            menuItem.dataset.quantity = quantity;                                                   // 감소된 수량을 데이터셋에 저장.
            menuItem.querySelector('.quantity').innerText = quantity;                               // 수량 표시 UI를 업데이트.
            menuItem.dataset.subtotal = (quantity * parseFloat(menuItem.dataset.price)).toFixed(0); // 새로운 소계를 계산.
            menuItem.querySelector('.subtotal').innerText = `${menuItem.dataset.subtotal}원`;       // 소계 표시 UI를 업데이트.
            updateTotal();
        }
    } else if (event.target.classList.contains('increment-button')) {                               // 수량 증가 버튼 클릭 시
        const menuItem = event.target.closest('.menu');                                             // 클릭된 버튼이 속한 메뉴 요소를 가져옴.
        let quantity = parseInt(menuItem.dataset.quantity);                                         // 현재 수량을 정수로 변환하여 가져옴.
        quantity += 1;                                                                              // 수량을 1 증가.
        menuItem.dataset.quantity = quantity;                                                       // 증가된 수량을 데이터셋에 저장.
        menuItem.querySelector('.quantity').innerText = quantity;                                   // 수량 표시 UI를 업데이트.
        menuItem.dataset.subtotal = (quantity * parseFloat(menuItem.dataset.price)).toFixed(0);     // 새로운 소계를 계산.
        menuItem.querySelector('.subtotal').innerText = `${menuItem.dataset.subtotal}원`;           // 소계 표시 UI를 업데이트.
        updateTotal();                                                                              // 총액을 다시 계산하여 업데이트.
    }
});


document.addEventListener('click', function(event) {                    // 결제 및 영수증 처리
    if (event.target.id === 'paymentButton') {                          // 클릭된 버튼이 결제 버튼인지 확인.
        const cartItems = document.querySelectorAll('#boxCart .menu');  // 장바구니에 담긴 모든 메뉴 요소를 가져옴.
        if (cartItems.length === 0) {                                   // 장바구니가 비어 있는 경우.
            alert('장바구니가 비어 있습니다!');                           // 경고 메시지를 표시하고 함수 종료.
            return;
        }

        let receipt = '영수증:\n';                                      // 영수증의 기본 제목을 설정.
        cartItems.forEach(item => {                                     // 장바구니 아이템들을 순회하며 영수증 내용 작성.
            const name = item.getAttribute('menuname');                 // 메뉴 이름을 가져옴.
            const quantity = item.dataset.quantity;                     // 수량을 가져옴.
            const subtotal = item.dataset.subtotal;                     // 소계를 가져옴.
            receipt += `${name} - ${quantity}개: ${subtotal}원\n`;      // 영수증에 메뉴, 수량, 소계를 추가.
        });

        receipt += `\n총액: ${totalAmount.toFixed(0)}원\n감사합니다!`;   // 총액과 감사 메시지를 영수증에 추가.
        alert(receipt);                                                 // 작성된 영수증을 경고창으로 표시.

        
        cartItems.forEach(item => {                                     // 화면 초기화
            document.getElementById('boxMenu').appendChild(item);       // 장바구니의 메뉴를 다시 메뉴 영역(boxMenu)로 이동.
            item.dataset.quantity = 0;                                  // 메뉴의 수량 데이터를 0으로 초기화.
            item.dataset.subtotal = 0;
            item.querySelector('.quantity-wrapper')?.remove();          // 수량 조정 UI 요소가 있으면 제거.
            item.querySelector('.subtotal')?.remove();                  // 소계 표시 UI 요소가 있으면 제거.
        });
        updateTotal();                                                  // 초기화된 상태를 반영하여 총액을 다시 계산.
    }
});


document.addEventListener('click', function(event) {                      // 관리자 기능: 메뉴 추가 및 삭제
    if (event.target.id === 'addMenuButton') {                            // 클릭된 버튼이 "메뉴 추가 버튼"인지 확인.
        const menuName = prompt('추가할 메뉴 이름을 입력하세요:');          // 메뉴 이름 입력받기.
        const menuPrice = parseFloat(prompt('메뉴의 가격을 입력하세요:'));  // 메뉴 가격 입력받아 숫자로 변환.
        if (!menuName || isNaN(menuPrice)) {                              // 입력된 메뉴 이름이나 가격이 유효하지 않을 경우 경고.
            alert('유효한 메뉴 이름과 가격을 입력하세요.');                  // 경고 메시지 출력.
            return;                                                       // 함수 종료.
        }

        const newMenu = document.createElement('div');                    // 새로운 메뉴 생성
        newMenu.className = 'menu';                                       // 새 메뉴에 "menu" 클래스 추가.
        newMenu.setAttribute('draggable', 'true');                        // 드래그 가능하도록 설정.
        newMenu.setAttribute('menuname', menuName);                       // 메뉴 이름을 속성으로 설정.
        newMenu.dataset.price = menuPrice;                                // 메뉴 가격을 데이터 속성으로 저장.


        const menuContent = document.createElement('div');                // 메뉴 내용을 표시하는 요소 생성
        menuContent.innerText = `${menuName} - ${menuPrice}원`;           // 메뉴 이름과 가격 텍스트 설정.
        newMenu.appendChild(menuContent);                                 // 메뉴 내용 요소를 새 메뉴에 추가.

                                                                          
        newMenu.addEventListener("dragstart", onDragStartMenu);           // 드래그 시작 이벤트 처리.
        newMenu.addEventListener("dragend", onDragEndMenu);               // 드래그 종료 이벤트 처리.

        document.getElementById('boxMenu').appendChild(newMenu);          // 생성된 메뉴를 메뉴 영역(boxMenu)에 추가
    }

});

// 관리자 창 열기 및 비밀번호 확인
document.addEventListener('click', function(event) {
    if (event.target.id === 'adminButton') {                                             // 클릭된 버튼이 "관리자 버튼"인지 확인.
        const password = prompt('관리자 비밀번호를 입력하세요:');                           // 비밀번호 입력 창 표시.
        if (password === '202430952') {                                                   // 비밀번호 검증
            const adminWindow = window.open('', 'AdminWindow', 'width=400,height=600');   // 새 창 열기 (관리자 창).

            // 관리자 창에 관리자 기능 UI 추가
            adminWindow.document.write(`                                                 
                <h1>관리자 기능</h1>
                <button id="addMenuButton">메뉴 추가</button>
                <button id="deleteMenuButton">메뉴 삭제</button>
                <button id="viewSalesHistoryButton">판매 내역 보기</button>
                <button id="clearSalesHistoryButton">판매 내역 초기화</button>
                <div id="adminLog"></div>
            `);

            // 관리자 기능 이벤트 리스너 추가
            adminWindow.document.getElementById('addMenuButton').addEventListener('click', () => { 
                const menuName = prompt('추가할 메뉴 이름을 입력하세요:');           // 메뉴 이름 입력받기.
                const menuImage = prompt('메뉴 이미지 경로를 입력하세요:');          // 메뉴 이미지 경로 입력받기.
                const menuPrice = parseFloat(prompt('메뉴의 가격을 입력하세요:'));   // 메뉴 가격 입력받아 숫자로 변환.


                if (!menuName || isNaN(menuPrice)) {                               // 입력된 메뉴 이름 또는 가격이 유효하지 않을 경우.
                    alert('유효한 메뉴 이름과 이미지 경로 가격을 입력하세요.');        // 경고 메시지 출력.
                    return;                                                        // 함수 종료.
                }

                const newMenu = document.createElement('div');
                newMenu.className = 'menu';                                        // 새 메뉴에 "menu" 클래스 추가.
                newMenu.setAttribute('draggable', 'true');                         // 드래그 가능하도록 설정.
                newMenu.setAttribute('menuname', menuName);                        // 메뉴 이름을 속성으로 설정.
                newMenu.dataset.price = menuPrice;                                 // 메뉴 가격을 데이터 속성으로 저장.
                
                // 메뉴 내용을 표시하는 요소 생성
                const menuContent = document.createElement('div');
                menuContent.innerText = `${menuName} - ${menuPrice}원`;
                newMenu.appendChild(menuContent);                                  // 메뉴 내용 요소를 새 메뉴에 추가.

                newMenu.addEventListener("dragstart", onDragStartMenu);            // 드래그 시작 이벤트 처리
                newMenu.addEventListener("dragend", onDragEndMenu);                // 드래그 종료 이벤트 처리.

                // 메뉴를 메인 메뉴 박스에 추가가
                document.getElementById('boxMenu').appendChild(newMenu);                                    // 새로 새성된 메뉴를 메인 메뉴 영역(boxMenu)에 추가
                // 로그에 추가 완료 메시지 표시
                adminWindow.document.getElementById('adminLog').innerText = `메뉴 "${menuName}" 추가 완료.`; // 관리자 로그에 추가 완료 메시지 출력.
            });
            // 메뉴 삭제 기능
            adminWindow.document.getElementById('deleteMenuButton').addEventListener('click', () => {       
                const menuName = prompt('삭제할 메뉴 이름을 입력하세요:');                                    // 삭제할 메뉴 이름을 입력받음.
                const menuList = document.querySelectorAll('.menu');                                        // 현재 존재하는 모든 메뉴를 선택.
                let deleted = false;                                                                        // 삭제 상태를 추적하기 위한 변수 초기화.
                
                // 메뉴 리스트 순회
                menuList.forEach(menu => {
                    if (menu.getAttribute('menuname') === menuName) {   // 입력된 이름과 일치하는 메뉴 찾기.
                        menu.remove();                                  // 해당 메뉴 제거.
                        deleted = true;                                 // 삭제 상태를 true로 설정.
                    }
                });

                // 삭제 결과에 따라 로그 메시지 업데이트
                if (deleted) {
                    adminWindow.document.getElementById('adminLog').innerText = `메뉴 "${menuName}" 삭제 완료.`;            // 성공 메시지.
                } else {
                    adminWindow.document.getElementById('adminLog').innerText = `메뉴 "${menuName}"를 찾을 수 없습니다.`;   // 실패 메시지.
                }
            });
            
            // 판매 내역 보기 버튼 클릭 이벤트 추가
            adminWindow.document.getElementById('viewSalesHistoryButton').addEventListener('click', () => {
                let history = '판매 내역:\n';                                               // 판매 내역의 초기 제목 설정.
                let totalSales = 0;                                                         // 총 판매 금액 초기화.

                // 판매 내역 리스트 순회회
                salesHistory.forEach(sale => {
                    history += `${sale.name} - ${sale.quantity}개: ${sale.subtotal}원\n`;   // 각 판매 항목을 문자열에 추가.
                    totalSales += parseFloat(sale.subtotal);                                // 판매 소계를 총 판매 금액에 합산.
                });
                history += `\n총 판매 금액: ${totalSales.toFixed(0)}원`;                     // 최종 총 판매 금액을 문자열에 추가.
                adminWindow.alert(history);                                                 // 작성된 판매 내역을 새 창의 알림으로 표시.
            });

            // 판매 내역 초기화 버튼 클릭 이벤트 추가
            adminWindow.document.getElementById('clearSalesHistoryButton').addEventListener('click', () => {
                salesHistory = [];                                                                    // 판매 내역 배열을 빈 배열로 초기화.
                adminWindow.alert('판매 내역이 초기화되었습니다.');                                     // 초기화 완료 메시지를 알림으로 표시.
                adminWindow.document.getElementById('adminLog').innerText = '판매 내역 초기화 완료.';  // 관리자 로그에 초기화 완료 메시지 출력.
            });
        } else {
            alert('비밀번호가 일치하지 않습니다.');                                                     // 비밀번호가 틀렸을 경우 경고 메시지 표시.
        }
    }
});


$(document).ready(function() {
    // 모든 메뉴 요소에 드래그 이벤트 추가
    const menuArray = document.getElementsByClassName("menu");
    for (let menu of menuArray) {
        menu.addEventListener("dragstart", onDragStartMenu); // 드래그 시작 이벤트 리스너 추가
        menu.addEventListener("dragend", onDragEndMenu);     // 드래그 종료 이벤트 리스너 추가
        const priceDisplay = document.createElement('div');
        priceDisplay.className = 'price-display';
        priceDisplay.innerText = `${menu.dataset.price}원`;  // 데이터셋에서 가격 가져와 텍스트 설정
        menu.appendChild(priceDisplay);


    }

    // 모든 드롭 박스에 드래그 이벤트 추가
    const boxArray = document.getElementsByClassName("box");
    for (let box of boxArray) {
        box.addEventListener("dragover", onDragOverBox);    // 드래그 오버 이벤트 리스너 추가
        box.addEventListener("dragleave", onDragLeaveBox);  // 드래그 떠남 이벤트 리스너 추가
        box.addEventListener("drop", onDropBox);            // 드롭 이벤트 리스너 추가
    }

    // 총액 표시 요소 생성 및 추가
    const totalDisplay = document.createElement('div');
    totalDisplay.id = 'totalDisplay';
    totalDisplay.innerText = '총액: 0원';
    document.body.appendChild(totalDisplay);                // 총액 표시 요소를 문서의 body에 추가

    // 결제 버튼 추가
    const paymentButton = document.createElement('button');
    paymentButton.id = 'paymentButton';
    paymentButton.innerText = '결제';
    document.body.appendChild(paymentButton);                // 결제 버튼을 문서의 body에 추가

    // 관리자 버튼 추가
    const adminButton = document.createElement('button');
    adminButton.id = 'adminButton';
    adminButton.innerText = '관리자';
    adminButton.style.position = 'absolute';
    adminButton.style.top = '10px';
    adminButton.style.right = '10px';
    document.body.appendChild(adminButton);                 // 관리자 버튼을 문서의 body에 추가
});
