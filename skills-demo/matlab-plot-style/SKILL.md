---
name: matlab-plot-style
description: Format and export MATLAB figures/plots using consistent scientific-plotting conventions for figure size, typography, axes, grids, colors, legends, colorbars, and high-resolution output.
---


MATLAB Plot Style
Purpose                                                                                    
 Provide concise MATLAB conventions for producing clean, consistent scientific figures. Use 
 these defaults unless a specific alternative is requested.                                 
                                                                                            
 Core principles                                                                            
 - Keep visuals legible at presentation resolution (1920×1080) and at high export           
   resolution (300 DPI).                                                                    
 - Do not change MATLAB's default font family unless explicitly requested.                  
 - Favor clarity: readable ticks/labels, clear grid, visible line widths, and sensible      
   legend placement.                                                                        
                                                                                            
 Figure size and DPI — MATLAB specifics                                                     
 - In MATLAB the figure Position is expressed in screen pixels, so set the on-screen/window 
   size directly:                                                                           
     f = figure('Visible','off');                                                           
     f.Position = [100, 100, 1920, 1080];  % left, bottom, width(px), height(px)            
 - Export resolution is independent of on-screen pixels. Use exportgraphics or print to     
   control output DPI:                                                                      
     exportgraphics(f, 'Figure_Name.png', 'Resolution', 300);                               
   or (older):                                                                              
     set(gcf, 'PaperPositionMode', 'auto');                                                 
     print(gcf, '-dpng', '-r300', 'Figure_Name.png');                                       
 - Practical rule: set Position for the desired interactive canvas; set export Resolution   
   for saved image quality. This keeps interactive appearance stable while allowing         
   controlled, high-resolution exports.                                                     
                                                                                            
 Default styling (suggested)                                                                
 - Axes and tick labels: FontSize = 24, FontWeight = 'bold'                                 
 - Axis labels: FontSize = 24, FontWeight = 'bold'                                          
 - Title: FontSize = 32                                                                     
 - Legend text: ~24                                                                         
 - Default line width: 1.5; reference lines: 2.0                                            
 - Grid: grid on; box on                                                                    
                                                                                            
 Axes, grid, and spines                                                                     
 - Enable grid and box:                                                                     
     ax = gca;                                                                              
     ax.FontSize = 24;                                                                      
     ax.FontWeight = 'bold';                                                                
     grid(ax, 'on');                                                                        
     box(ax, 'on');                                                                         
 - Keep spines (axes edges) visible and moderately thin (LineWidth ~ 1.0).                  
                                                                                            
 Lines, markers, and colors                                                                 
 - Use black for primary data lines; use contrasting colors for references (e.g., red).     
 - For elements with edges, prefer black edge color.                                        
 - Use markers when points are important; keep marker size readable at export DPI.          
                                                                                            
 Ticks and formatting                                                                       
 - Use “nice” tick spacing and include endpoints when helpful.                              
 - Rotate long tick labels only when needed; use xtickangle/ytickangle.                     
 - Prefer numeric formatting that is concise and consistent.                                
                                                                                            
 Legends and annotations                                                                    
 - Use legend(...,'Location','best') unless manual placement needed.                        
 - Keep legend font size consistent with axis labels.                                       
 - Use text/annotation sparingly and with bold size ~24 for emphasis.                       
                                                                                            
 Export                                                                                     
 - Default PNG export: 300 DPI.                                                             
 - Use exportgraphics(f, 'name.png', 'Resolution', 300, 'BackgroundColor', 'none') or print 
   with -r300.                                                                              
 - For vector output: exportgraphics(f, 'name.pdf', 'ContentType', 'vector').               
 - Use descriptive filenames and bbox-tight equivalents (exportgraphics handles tight       
   cropping).                                                                               
                                                                                            
 Minimal MATLAB example                                                                     
     % create 1920x1080 on-screen canvas and export at 300 DPI                              
     f = figure('Visible','off');                                                           
     f.Position = [100, 100, 1920, 1080];                                                   
     x = 1:50;                                                                              
     y = 4cumsum((-1).^(0:49)./(2(0:49)+1));                                                
     plot(x, y, '-ok', 'LineWidth', 1.5, 'MarkerFaceColor', 'k');                           
     hold on;                                                                               
     yline(pi, 'r', 'LineWidth', 2.0);                                                      
     ax = gca;                                                                              
     ax.FontSize = 24;                                                                      
     ax.FontWeight = 'bold';                                                                
     xlabel('Number of terms n', 'FontSize', 24, 'FontWeight', 'bold');                     
     ylabel('Value', 'FontSize', 24, 'FontWeight', 'bold');                                 
     title('Leibniz partial sums vs \pi', 'FontSize', 32);                                  
     grid on; box on;                                                                       
     legend('Leibniz partial sums', '\pi (flat line)', 'Location', 'best');                 
     % export high-resolution PNG                                                           
     exportgraphics(f, 'Figure_Name.png', 'Resolution', 300);
