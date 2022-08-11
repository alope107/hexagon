const audioCtx = new AudioContext();

const choose = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)];
}

const boop = async () => {
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    //osc.connect(audioCtx.destination);
    const freqs = [262, 294.8, 327.5, 349.3, 393, 436.7, 491.2, 524, 589.5];
    osc.frequency.value = choose(freqs);

    const g = audioCtx.createGain();
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start();

    const ramp = 3;
    const finishTime = audioCtx.currentTime + ramp;
    g.gain.exponentialRampToValueAtTime(.00001, finishTime);
    osc.stop(finishTime);

    
    // await new Promise(r => setTimeout(r, 300));
    // osc.stop();
}