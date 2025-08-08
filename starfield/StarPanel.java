import javax.swing.JPanel;
import javax.swing.Timer;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StarPanel extends JPanel implements ActionListener {

    private final int DELAY = 15;
    private Timer timer;
    private List<Star> stars1;
    private List<Star> stars2;
    private List<Star> stars3;

    private static class Star {
        int x, y, size;
        Color color;
        double speed;

        Star(int x, int y, int size, Color color, double speed) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.speed = speed;
        }

        public void move() {
            y -= speed;
            if (y < -size) {
                y = 2000; 
            }
        }
    }

    public StarPanel() {
        initPanel();
    }

    private void initPanel() {
        setBackground(Color.BLACK);
        stars1 = new ArrayList<>();
        stars2 = new ArrayList<>();
        stars3 = new ArrayList<>();
        
        // Os dados serão carregados de arquivos externos
        loadStarsFromFile("stars1.txt", stars1, 1, Color.decode("#D63C4D"), 1.0);
        loadStarsFromFile("stars2.txt", stars2, 2, Color.decode("#1d92d5"), 2.0);
        loadStarsFromFile("stars3.txt", stars3, 3, Color.decode("#7111F5"), 3.0);

        timer = new Timer(DELAY, this);
        timer.start();
    }

    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        drawStars(g);
        Toolkit.getDefaultToolkit().sync();
    }

    private void drawStars(Graphics g) {
        Graphics2D g2d = (Graphics2D) g;
        
        drawStarLayer(g2d, stars1);
        drawStarLayer(g2d, stars2);
        drawStarLayer(g2d, stars3);
    }

    private void drawStarLayer(Graphics2D g2d, List<Star> stars) {
        for (Star star : stars) {
            g2d.setColor(star.color);
            g2d.fillRect(star.x / 2, star.y / 2, star.size, star.size); // Redimensionando para caber na tela
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        updateStars();
        repaint();
    }

    private void updateStars() {
        for (Star star : stars1) {
            star.move();
        }
        for (Star star : stars2) {
            star.move();
        }
        for (Star star : stars3) {
            star.move();
        }
    }

    private void loadStarsFromFile(String filePath, List<Star> starList, int size, Color color, double speed) {
        try (InputStream is = new java.io.FileInputStream(filePath);
             BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            
            String line;
            StringBuilder content = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                content.append(line);
            }
            parseStars(content.toString(), starList, size, color, speed);

        } catch (IOException | NullPointerException e) {
            e.printStackTrace();
        }
    }

    private void parseStars(String cssData, List<Star> starList, int size, Color color, double speed) {
        Pattern pattern = Pattern.compile("(\\d+)px\\s(\\d+)px");
        Matcher matcher = pattern.matcher(cssData);
        while (matcher.find()) {
            int x = Integer.parseInt(matcher.group(1));
            int y = Integer.parseInt(matcher.group(2));
            starList.add(new Star(x, y, size, color, speed));
        }
    }
}