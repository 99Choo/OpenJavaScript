let draggingMenu = null;    // 현재 드래그 중인 메뉴를 저장하기 위한 변수
let dragOverBox = null;     // 드래그 오버 중인 박스를 저장하기 위한 변수
let totalAmount = 0;        // 총액을 계산하고 저장하기 위한 변수
let salesHistory = [];

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
        let currentSale = [];                                           // 현재 판매 내역 기록
        let totalSales = 0;

        cartItems.forEach(item => {
            const name = item.getAttribute('menuname');
            const quantity = parseInt(item.dataset.quantity);
            const subtotal = parseFloat(item.dataset.subtotal);
            receipt += `${name} - ${quantity}개: ${subtotal}원\n`;
            currentSale.push({ name, quantity, subtotal });
            totalSales += subtotal;
        });

        receipt += `\n총액: ${totalAmount.toFixed(0)}원\n감사합니다!`;   // 총액과 감사 메시지를 영수증에 추가.
        alert(receipt);                                                 // 작성된 영수증을 경고창으로 표시.

        salesHistory.push({ items: currentSale, total: totalSales, date: new Date() }); // 판매 내역에 추가
        console.log('Current Sales History:', salesHistory);


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

document.addEventListener('click', function(event) {
    if (event.target.id === 'adminButton') {
        const password = prompt('관리자 비밀번호를 입력하세요:');
        if (password === '202430952') {
            alert('관리자 모드에 접속했습니다.');
            showAdminPopup();
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    }
});

function showAdminPopup() {
    document.querySelector('.admin-popup')?.remove();
    const popup = document.createElement('div');
    popup.className = 'admin-popup';
    popup.innerHTML = `
        <h2>메뉴 추가</h2>
        <label>메뉴 이름:</label>
        <input type="text" id="menuName" placeholder="메뉴 이름을 입력하세요">
        <label>이미지 선택:</label>
        <button id="selectImageButton">이미지 선택</button>
        <input type="file" id="imageUpload" accept="image/*" style="display: none;">
        <div id="previewArea"></div>
        <label>메뉴 가격:</label>
        <input type="number" id="menuPrice" placeholder="메뉴 가격을 입력하세요">
        <button id="addMenuButton">메뉴 추가</button>
        <button id="closePopup">닫기</button>
    `;
    document.body.appendChild(popup);
    popup.style.display = "block";

    document.getElementById('selectImageButton').addEventListener('click', () => {
        document.getElementById('imageUpload').click(); // 숨겨진 파일 입력 클릭
    });

    document.getElementById('imageUpload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewArea = document.getElementById('previewArea');
                previewArea.innerHTML = ''; // 기존 미리 보기 초기화
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result; // 파일 내용을 Data URL로 설정
                imgElement.style.width = '100px';
                imgElement.style.height = '100px';
                previewArea.appendChild(imgElement);
                imgElement.dataset.imageUrl = e.target.result; // 선택된 이미지를 데이터 속성으로 저장
            };
            reader.readAsDataURL(file); // 파일을 Data URL로 읽기
        }
    });

    document.getElementById('addMenuButton').addEventListener('click', handleAddMenu);
    document.getElementById('closePopup').addEventListener('click', () => popup.remove());
}

function updateSalesHistoryDisplay() {
    const salesTableBody = document.querySelector('#salesTable tbody');
    const totalSalesDisplay = document.getElementById('totalSalesDisplay');

    // 기존 내용을 초기화
    salesTableBody.innerHTML = '';
    let grandTotal = 0;

    salesHistory.forEach(sale => {
        sale.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.date.toLocaleString()}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.subtotal.toFixed(0)}원</td>
                <td>${sale.total.toFixed(0)}원</td>
            `;
            salesTableBody.appendChild(row);
        });
        grandTotal += sale.total;
    });

    totalSalesDisplay.innerText = `총 판매 금액: ${grandTotal.toFixed(0)}원`;
}

function handleAddMenu() {    
    const menuName = document.getElementById('menuName').value;
    const menuPrice = parseFloat(document.getElementById('menuPrice').value);
    const previewArea = document.getElementById('previewArea').querySelector('img');
    const menuImage = previewArea ? previewArea.dataset.imageUrl : null;

    if (!menuName || !menuImage || isNaN(menuPrice)) {
        alert('모든 필드를 정확히 입력하세요.');
        return;
    }

    const newMenu = document.createElement('div');
    newMenu.className = 'menu';
    newMenu.setAttribute('draggable', 'true');
    newMenu.setAttribute('menuname', menuName);
    newMenu.dataset.price = menuPrice;

    newMenu.innerHTML = `
        <div>${menuName} - ${menuPrice}원</div>
        <img src="${menuImage}" alt="${menuName}" style="width: 225px; height: 225px;">
    `;
    newMenu.addEventListener('dragstart', onDragStartMenu);
    newMenu.addEventListener('dragend', onDragEndMenu);
    document.getElementById('boxMenu').appendChild(newMenu);
    alert('메뉴가 추가되었습니다!');
    document.querySelector('.admin-popup').remove();
}


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
