import { useState, useEffect, useCallback, useRef } from 'react';
import { analyticsAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const usePomodoro = (initialMinutes = 25) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');
  const [sessions, setSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f4B/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH9/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f3+AgH9/f4B/f3+AgH9/f3+AgH+AgH9/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f3+AgH+AgH9/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f3+AgH9/f4B/f3+AgH9/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH+AgH9/f4B/f3+AgH8=');
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  }, [initialMinutes]);

  const switchMode = useCallback((newMode) => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'focus') {
      setMinutes(initialMinutes);
    } else if (newMode === 'shortBreak') {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  }, [initialMinutes]);

  const toggle = useCallback(() => {
    if (minutes === 0 && seconds === 0) {
      reset();
    }
    setIsActive(prev => !prev);
  }, [minutes, seconds, reset]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            playSound();
            if (mode === 'focus') {
              setSessions(s => s + 1);
              setTotalMinutes(t => t + initialMinutes);
              analyticsAPI.updateStats({ stats: { totalFocusMinutes: totalMinutes + initialMinutes, pomodoroSessions: sessions + 1 } }).catch(() => {});
              toast.success('Focus session complete! Take a break.');
              if (sessions > 0 && (sessions + 1) % 4 === 0) {
                switchMode('longBreak');
              } else {
                switchMode('shortBreak');
              }
            } else {
              toast.success('Break over! Ready to focus?');
              switchMode('focus');
            }
            return;
          }
          setMinutes(m => m - 1);
          setSeconds(59);
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds, mode, sessions, totalMinutes, initialMinutes, switchMode]);

  const progress = mode === 'focus'
    ? ((initialMinutes * 60 - (minutes * 60 + seconds)) / (initialMinutes * 60)) * 100
    : mode === 'shortBreak'
      ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
      : ((15 * 60 - (minutes * 60 + seconds)) / (15 * 60)) * 100;

  return {
    minutes, seconds, isActive, mode, sessions, totalMinutes, progress,
    toggle, reset, switchMode, setMinutes: m => { setMinutes(m); setSeconds(0); }
  };
};
