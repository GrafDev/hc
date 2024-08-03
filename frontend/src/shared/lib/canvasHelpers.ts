import {SpotifySong} from "../../entities/song/model/types.ts";

interface Point {
    x: number;
    y: number;
}

export interface Node extends Point {
    radius: number;
    song: SpotifySong;
}

export interface Edge {
    start: Point;
    end: Point;
    weight: number;
}

export function drawNode(ctx: CanvasRenderingContext2D, node: Node, color: string = '#4CAF50'): void {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

export function drawEdge(ctx: CanvasRenderingContext2D, edge: Edge, color: string = 'rgba(200, 200, 200, 0.5)'): void {
    ctx.beginPath();
    ctx.moveTo(edge.start.x, edge.start.y);
    ctx.lineTo(edge.end.x, edge.end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = edge.weight;
    ctx.stroke();
    ctx.closePath();
}

export function drawLabel(ctx: CanvasRenderingContext2D, node: Node, text: string): void {
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(text, node.x, node.y + node.radius + 15);
}

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function scaleCanvas(canvas: HTMLCanvasElement, scale: number): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);
}

export function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): Point {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

export function isPointInNode(point: Point, node: Node): boolean {
    const dx = point.x - node.x;
    const dy = point.y - node.y;
    return dx * dx + dy * dy <= node.radius * node.radius;
}