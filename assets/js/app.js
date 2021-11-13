// Define WrapperWS
function WrapperWS(action) {
    if ("WebSocket" in window) {
        var ws = new WebSocket("ws://125.214.0.120:81/tts_api");
        var self = this;

        ws.onopen = function () {
            console.log("Opening a connection...");
            window.identified = false;
        };
        ws.onclose = function (evt) {
            console.log("I'm sorry. Bye!");
        };
        ws.onmessage = function (evt) {
            //console.log(evt.data);
            const msg = JSON.parse(evt.data);
            console.log(msg);
            if (typeof msg === 'object' && msg !== null) {
                const audioPath = msg.body.audio_path;
                console.log(audioPath);
                //const a = new Audio(audioPath);
                //a.play();

                switch (action) {
                    case 'play':
                        return new Promise(function(resolve, reject) {   // return a promise
                            const audio = new Audio(audioPath);                     // create audio wo/ src
                            audio.preload = "auto";                      // intend to play through
                            audio.autoplay = true;                       // autoplay when loaded
                            audio.onerror = reject;                      // on error, reject
                            audio.onended = resolve;                     // when done, resolve
                        });

                    case 'download':
                        let link = document.createElement("a");
                        //link.download = name;
                        link.href = audioPath;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        delete link;
                }
            }

        };
        ws.onerror = function (evt) {
            console.log("ERR: " + evt.data);
        };

        this.write = function () {
            if (!window.identified) {
                connection.ident();
                console.debug("Wasn't identified earlier. It is now.");
            }
            ws.send(theText.value);
        };

        this.send = function (message, callback) {
            this.waitForConnection(function () {
                ws.send(message);
                if (typeof callback !== 'undefined') {
                    callback();
                }
            }, 1000);
        };

        this.waitForConnection = function (callback, interval) {
            if (ws.readyState === 1) {
                callback();
            } else {
                var that = this;
                // optional: implement backoff for interval here
                setTimeout(function () {
                    that.waitForConnection(callback, interval);
                }, interval);
            }
        };

        this.ident = function () {
            const text = "Tuyên ngôn độc lập văn kiện có ý nghĩa lịch sử sống còn với vận mệnh dân tộc. Nếu ở Mỹ có Tuyên ngôn độc lập năm 1776, ở Pháp có bản Tuyên ngôn Nhân quyền và Dân quyền năm 1791 thì Việt Nam có bản\n" +
                "Tuyên ngôn độc lập của Hồ Chí Minh, được tuyên bố ngày mồng 2 tháng 9 năm 1945, tại quảng trường Ba Đình để xóa bỏ chế độ thực dân, phong kiến; khẳng định quyền tự chủ và vị thế của dân tộc ta trên thế giới, đó là mốc son chói lọi đánh dấu kỉ nguyên mới kỉ nguyên độc lập, tự do của dân tộc Việt Nam.\n" +
                "\n" +
                "Tuyên ngôn độc lập được Bác triển khai theo ba nội dung rõ ràng. Phần mở đầu: Bác có đưa ra cơ sở cho bản Tuyên ngôn nói về quyền bình đẳng, quyền sống, quyền tự do, quyền mưu cầu hạnh phúc dựa vào hai bản tuyên ngôn của Mỹ và Pháp-hai nước tư bản lớn trên thế giới-hai quốc gia xâm lược Việt Nam. Bác dùng những lí lẽ đó để làm bản lề vạch ra cho ta thấy những việc làm trái với tuyên ngôn của chúng. Phần nội dung: Những cơ sở thực tế đã được chỉ ra, đó là những tội ác của Pháp, chúng đã thi hành ở nước ta hơn 80 năm nay trên các lĩnh vực: chính trị, kinh tế, văn hóa giáo dục. Tất cả những điều đó đập tan luận điệu xảo trá của kẻ thù đã, đang và sẽ nô dịch nước ta trở lại. Phần kết luận: Lời tuyên bố đanh thép và khẳng định quyết tâm sắt đá giữ vững nền độc lập dân tộc. Tuyên ngôn độc lập đã hội tụ vẻ đẹp tư tưởng và tình cảm của Hồ Chí Minh đồng thời cho thấy khát vọng cháy bỏng về độc lập, tự do của nhân dân Việt Nam.";

            const msg = {
                'text': document.getElementById("text").value,
                //'text': text,
                'speed': 1.0,
                'voice': document.querySelector('input[name="voice"]:checked').value,
                'full_mp3': 1,
            };

            this.send(JSON.stringify(msg), function () {
                //console.log(e.target);
                /*window.identified = true;
                theText.value = "Hello!";
                say.click();
                theText.disabled = false;*/
            });
        };

    }
}