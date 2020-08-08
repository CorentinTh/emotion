import 'spectre.css';
import * as faceapi from 'face-api.js';

const modelsBaseURL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@latest/weights'

const emotions = {
    happy: "😀",
    angry: "😡",
    disgusted: "🤢",
    fearful: "😱",
    neutral: "😐",
    surprised: "😳",
    sad: '😟'
};

const expressionsWrapperEl: HTMLElement = document.getElementById('expressions-wrapper');
const videoEl: HTMLVideoElement = <HTMLVideoElement>document.getElementById('video');
const cameraPermissionEl: HTMLElement = document.getElementById('camera-permission');
const loadingWrapperEl: HTMLElement = document.getElementById('loading-wrapper');
const resultWrapperEl: HTMLElement = document.getElementById('result-wrapper');
const emojiWrapperEl: HTMLElement = document.getElementById('emoji-wrapper');

const loop = async () => {
    const result = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

    if(result){
        const expressions = result.expressions.asSortedArray()
        const emotionLabel = expressions[0].expression;
        const emoji = emotions[emotionLabel];

        emojiWrapperEl.innerText = emoji
        expressionsWrapperEl.innerHTML = '<table class="col-mx-auto"><tr>' + expressions
            .map(e => `<td>${e.expression}</td><td>${e.probability.toFixed(2)}</td>`)
            .join('</tr><tr>') + '</tr></table>'
    }

    requestAnimationFrame(() => loop());
}

const setup = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelsBaseURL);
    await faceapi.nets.faceExpressionNet.loadFromUri(modelsBaseURL);

    try {
        videoEl.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        videoEl.onloadedmetadata = loop;
        resultWrapperEl.hidden = false;
    }catch (e) {
        cameraPermissionEl.hidden = false;
    }
    loadingWrapperEl.hidden = true;
}

window.onload = setup;


