const audioCtx = new AudioContext();

console.log(math.complex(1, 2));

const choose = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)];
}

const buffabeef = () => {
    // Yoinked from https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBuffer 
    // Create an empty three-second stereo buffer at the sample rate of the AudioContext
    const myArrayBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 3, audioCtx.sampleRate);
    console.log("sampleRate", audioCtx.sampleRate);

    // Fill the buffer with sine wave
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    // This gives us the actual ArrayBuffer that contains the data
    const nowBuffering = myArrayBuffer.getChannelData(channel);
    const desiredFreq = 440; // in hz
    for (let i = 0; i < myArrayBuffer.length; i++) {
        nowBuffering[i] = Math.sin(i*((2*Math.PI*desiredFreq) / audioCtx.sampleRate));
    }
    }

    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    const source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = myArrayBuffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioCtx.destination);
    // start the source playing
    source.start();
}

const boop = async () => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    //osc.connect(audioCtx.destination);
    const freqs = [262, 294.8, 327.5, 349.3, 393, 436.7, 491.2, 524, 589.5];
    //osc.frequency.value = choose(freqs);
    osc.frequency.value = 440;

    osc.connect(audioCtx.destination);
    osc.start();

    await new Promise(r => setTimeout(r,1000))
    osc.stop();

    // const g = audioCtx.createGain();
    // osc.connect(g);
    // g.connect(audioCtx.destination);
    // osc.start();

    // const ramp = 3;
    // const finishTime = audioCtx.currentTime + ramp;
    // g.gain.exponentialRampToValueAtTime(.00001, finishTime);
    // osc.stop(finishTime);

    
    // await new Promise(r => setTimeout(r, 300));
    // osc.stop();
}