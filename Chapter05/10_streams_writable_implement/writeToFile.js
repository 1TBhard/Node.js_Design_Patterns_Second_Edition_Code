"use strict";

const ToFileStream = require("./toFileStream.js");
// objectMode 활성화된 write stream
const tfs = new ToFileStream();

// objectMode 활성화되어 객체로 인자 받음
tfs.write({ path: "file1.txt", content: "Hello" });
tfs.write({ path: "file2.txt", content: "Node.js" });
tfs.write({ path: "file3.txt", content: "Streams" });
tfs.end(() => console.log("All files created"));

// 실행 결과로 file1,txt, file2,txt, file3,txt 를 생성
