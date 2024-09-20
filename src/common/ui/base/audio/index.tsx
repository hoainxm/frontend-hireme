import React, { FC, useState } from 'react';
import Play from '@icon/PlayBlue.svg';
import Download from '@icon/Download.svg';
import Check from '@icon/Check.svg';
import ArrowDown from '@icon/ArrowDown.svg';
import Pause from '@icon/Pause.svg';
import { Image } from 'react-bootstrap';
import { SPEEDS } from '../../../../app/audio-processing/constant';
import style from './audio.module.scss';
import { formatDurationDisplay } from '../../../utils/common';


interface Props {
  audio: string | undefined;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const CAudio: FC<Props> = (props: Props) => {
  const { audio, audioRef } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setCurrentProgress(0);
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const changeSpeed = (value: number) => {
    setIsOpen(false);
    setSpeed(value);
    if (audioRef.current) audioRef.current.playbackRate = value;
  };

  const elapsedDisplay = formatDurationDisplay(currentProgress);
  const durationDisplay = formatDurationDisplay(duration);

  return (
    <>
      <div className={style.wrapperAudio}>
        <Image src={isPlaying ? Pause : Play} onClick={togglePlayPause} />
        <input
          className={style.processBar}
          type='range'
          name='progress'
          min={0}
          max={Math.ceil(duration)}
          value={Math.ceil(currentProgress)}
          onChange={(e) => {
            if (!audioRef.current) return;
            audioRef.current.currentTime = e.currentTarget.valueAsNumber;
            setCurrentProgress(e.currentTarget.valueAsNumber);
          }}
        />
        <div className={style.timer}>
          <span>{elapsedDisplay}</span>
          <span>/</span>
          <span>{durationDisplay}</span>
        </div>
        <div className={style.speedControl}>
          <div className={style.inputContent} onClick={() => setIsOpen(!isOpen)}>
            <span>{speed}x</span>
            <Image src={ArrowDown} height={16} width={16} />
          </div>
          <div className={`${style.dropdown} ${!isOpen && 'd-none'}`}>
            {SPEEDS.map((value) => (
              <div onClick={() => changeSpeed(value)}>
                {value === speed ? <Image src={Check} /> : <div className={style.boxEmpty}></div>}
                {value}x
              </div>
            ))}
          </div>
        </div>
        <a href={audio} download='downloaded_text_to_speech.mp3'>
          <Image src={Download} />
        </a>
      </div>
      <audio
        ref={audioRef}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => {
          setCurrentProgress(e.currentTarget.currentTime);
        }}
      >
        <source src={audio} />
      </audio>
    </>
  );
};

export default CAudio;
