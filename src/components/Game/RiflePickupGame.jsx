import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBullseye, FaTrophy, FaClock, FaStar } from 'react-icons/fa';

const RiflePickupGame = () => {
    const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [rifles, setRifles] = useState([]);
    const [collected, setCollected] = useState(0);
    const [gameSpeed, setGameSpeed] = useState(1000);
    const [highScore, setHighScore] = useState(localStorage.getItem('rifleGameHighScore') || 0);

    // Rifle types with different point values
    const rifleTypes = [
        { type: 'nerf', points: 10, color: 'bg-orange-500', name: 'Nerf Blaster' },
        { type: 'water', points: 15, color: 'bg-blue-500', name: 'Water Blaster' },
        { type: 'laser', points: 25, color: 'bg-purple-500', name: 'Laser Rifle' },
        { type: 'paintball', points: 30, color: 'bg-green-500', name: 'Paintball Gun' },
        { type: 'foam', points: 20, color: 'bg-yellow-500', name: 'Foam Rifle' }
    ];

    const generateRifle = useCallback(() => {
        const rifleType = rifleTypes[Math.floor(Math.random() * rifleTypes.length)];
        return {
            id: Math.random(),
            x: Math.random() * 80 + 10, // 10% to 90% of screen width
            y: Math.random() * 60 + 20, // 20% to 80% of screen height
            spawnTime: Date.now(),
            ...rifleType,
            collected: false
        };
    }, []);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setTimeLeft(60);
        setCollected(0);
        setGameSpeed(1000);
        setRifles([generateRifle()]);
    };

    const endGame = () => {
        setGameState('gameOver');
        const newHighScore = Math.max(score, highScore);
        setHighScore(newHighScore);
        localStorage.setItem('rifleGameHighScore', newHighScore);
    };

    const collectRifle = (rifleId) => {
        setRifles(prev => prev.map(rifle => 
            rifle.id === rifleId ? { ...rifle, collected: true } : rifle
        ));
        
        const rifle = rifles.find(r => r.id === rifleId);
        if (rifle) {
            setScore(prev => prev + rifle.points);
            setCollected(prev => prev + 1);
            
            // Remove collected rifle after animation
            setTimeout(() => {
                setRifles(prev => prev.filter(r => r.id !== rifleId));
            }, 500);
        }
    };

    // Game timer
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            endGame();
        }
        return () => clearTimeout(timer);
    }, [gameState, timeLeft]);

    // Spawn new rifles
    useEffect(() => {
        let spawner;
        if (gameState === 'playing') {
            spawner = setInterval(() => {
                setRifles(prev => {
                    const activeRifles = prev.filter(r => !r.collected);
                    if (activeRifles.length < 5) {
                        return [...prev, generateRifle()];
                    }
                    return prev;
                });
                // Increase game speed as score increases
                setGameSpeed(Math.max(500, 1000 - Math.floor(score / 100) * 50));
            }, gameSpeed);
        }
        return () => clearInterval(spawner);
    }, [gameState, gameSpeed, generateRifle, score]);

    // Auto-remove uncollected rifles
    useEffect(() => {
        if (gameState === 'playing') {
            const remover = setInterval(() => {
                setRifles(prev => prev.filter(rifle => 
                    rifle.collected || (Date.now() - rifle.spawnTime) < 10000
                ));
            }, 2000);
            return () => clearInterval(remover);
        }
    }, [gameState]);

    const GameMenu = () => (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8"
        >
            <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
            >
                🎯
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Rifle Pickup Challenge</h1>
            <p className="text-lg text-gray-600 mb-6">
                Collect rifles as fast as you can! Different rifles have different point values.
                You have 60 seconds to get the highest score possible!
            </p>
            <div className="mb-6">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <FaTrophy className="text-yellow-500 text-xl" />
                    <span className="text-lg font-semibold">High Score: {highScore}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {rifleTypes.map((rifle, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                            <div className={`w-4 h-4 rounded ${rifle.color}`}></div>
                            <span className="text-sm">{rifle.name}: {rifle.points}pts</span>
                        </div>
                    ))}
                </div>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors duration-300"
            >
                Start Game
            </motion.button>
        </motion.div>
    );

    const GameInterface = () => (
        <div className="relative w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden border-4 border-gray-300">
            {/* Game Stats */}
            <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        <span className="font-bold">Score: {score}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-red-500" />
                        <span className="font-bold">Time: {timeLeft}s</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaBullseye className="text-green-500" />
                        <span className="font-bold">Collected: {collected}</span>
                    </div>
                </div>
            </div>

            {/* Rifles */}
            <AnimatePresence>
                {rifles.map((rifle) => (
                    <motion.div
                        key={rifle.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                            scale: rifle.collected ? 0 : 1, 
                            opacity: rifle.collected ? 0 : 1,
                            rotate: rifle.collected ? 360 : 0
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: rifle.collected ? 0.5 : 0.3 }}
                        style={{
                            position: 'absolute',
                            left: `${rifle.x}%`,
                            top: `${rifle.y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                        className="cursor-pointer"
                        onClick={() => !rifle.collected && collectRifle(rifle.id)}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-12 h-8 ${rifle.color} rounded-lg shadow-lg border-2 border-white relative`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                {rifle.points}
                            </div>
                            <motion.div
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                            />
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Game Instructions */}
            {rifles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                        <div className="text-4xl mb-2">🎯</div>
                        <p className="text-lg">Click on rifles to collect them!</p>
                    </div>
                </div>
            )}
        </div>
    );

    const GameOver = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
        >
            <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-6xl mb-4"
            >
                {score > highScore ? '🏆' : '🎯'}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {score > highScore ? 'New High Score!' : 'Game Over!'}
            </h2>
            <div className="mb-6">
                <div className="text-2xl font-bold text-blue-600 mb-2">Final Score: {score}</div>
                <div className="text-lg text-gray-600 mb-2">Rifles Collected: {collected}</div>
                <div className="text-lg text-gray-600">High Score: {highScore}</div>
            </div>
            <div className="flex gap-4 justify-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                    Play Again
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGameState('menu')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                    Main Menu
                </motion.button>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {gameState === 'menu' && <GameMenu />}
                {gameState === 'playing' && (
                    <div className="p-6">
                        <GameInterface />
                    </div>
                )}
                {gameState === 'gameOver' && <GameOver />}
            </div>
        </div>
    );
};

export default RiflePickupGame;