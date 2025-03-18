'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FamilyTree as FamilyTreeType } from '@/types/family';

interface FamilyTreeProps {
  data: FamilyTreeType;
  width?: number;
  height?: number;
}

export default function FamilyTree({ data, width = 800, height = 600 }: FamilyTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 清除之前的内容
    d3.select(svgRef.current).selectAll('*').remove();

    // 创建树形布局
    const treeLayout = d3.tree<any>()
      .size([width - 200, height - 100])
      .separation((a, b) => (a.parent === b.parent ? 3 : 4)); // 增加节点间距

    // 转换数据为层次结构
    const root = d3.hierarchy(data.rootNode);
    const treeData = treeLayout(root);

    // 创建SVG容器
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(100,50)');

    // 绘制连接线
    svg.selectAll('path.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('d', (d: any) => {
        return `M${d.source.x},${d.source.y}
                L${d.source.x},${(d.source.y + d.target.y) / 2}
                L${d.target.x},${(d.source.y + d.target.y) / 2}
                L${d.target.x},${d.target.y}`;
      });

    // 添加关系标注
    svg.selectAll('text.relationship')
      .data(treeData.links())
      .enter()
      .append('text')
      .attr('class', 'relationship')
      .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
      .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#666')
      .attr('font-size', '12px')
      .text((d: any) => {
        if (d.target.data.spouse && d.source.data === d.target.data.spouse) {
          return d.target.data.spouse.spouse_relation || '配偶';
        }
        return d.target.data.relation || '子女';
      });

    // 创建节点组
    const nodes = svg.selectAll('g.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .attr('cursor', 'pointer');

    // 添加节点背景
    nodes.append('rect')
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('x', -50)
      .attr('y', -20)
      .attr('width', 100)
      .attr('height', 40)
      .attr('fill', 'white')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('filter', 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))');

    // 添加节点圆圈
    nodes.append('circle')
      .attr('r', 4)
      .attr('cx', -40)
      .attr('cy', 0)
      .attr('fill', '#fff')
      .attr('stroke', '#4299e1')
      .attr('stroke-width', 2);

    // 添加节点名称
    nodes.append('text')
      .attr('x', 0)
      .attr('y', 5)
      .attr('class', 'font-medium text-base text-center')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.data.name);

    // 添加鼠标悬浮提示框
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('font-size', '14px')
      .style('max-width', '200px');

    // 添加鼠标事件
    nodes
      .on('mouseover', (event: any, d: any) => {
        tooltip
          .style('visibility', 'visible')
          .html(`<strong>${d.data.name}</strong><br/>${d.data.description || ''}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', (event: any) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

  }, [data, width, height]);

  return <svg ref={svgRef} className="w-full h-full" />;
}