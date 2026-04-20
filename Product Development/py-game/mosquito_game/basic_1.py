import pygame
import time

pygame.font.init()

WIDTH, HEIGHT = 1280,620

WIN = pygame.display.set_mode((WIDTH,HEIGHT))
pygame.display.set_caption("Game")

BG = pygame.transform.scale(pygame.image.load("space_bg.jpg"),(WIDTH,HEIGHT))   

PLAYER_WIDTH = 40
PLAYER_HEIGHT = 60

PLAYER_VEL = 5

FONT = pygame.font.SysFont("comicsans",30)

def draw(player, elapsed_time):
    WIN.blit(BG,(0,0))

    time_text = FONT.render(f'Time: {round(elapsed_time)}s',1,"white")
    WIN.blit(time_text,(10,10))

    pygame.draw.rect(WIN,(255,0,0),player)

    pygame.display.update()
    

def main():
    run = True

    player = pygame.Rect(200, HEIGHT - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT)

    clock = pygame.time.Clock()
    start_time = time.time()
    elapsed_time = 0

    star_add_increment = 200 # ms -> To render the star in evey 200 ms
    star_count = 0 # Next star to be render on the screen

    stars = [] # The stars that are rendered on the screen that will be stored in this list


    while run:
        star_count +=  clock.tick(60)
        elapsed_time = time.time() - start_time


        for event in pygame.event.get():
            if event.type == pygame.QUIT:
               run = False
               break



        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] and player.x - PLAYER_VEL >= 0:
            player.x -= PLAYER_VEL
            print("Left: ",player.x - PLAYER_VEL)
        if keys[pygame.K_RIGHT] and (player.x + PLAYER_VEL + PLAYER_WIDTH) <= WIDTH:
            player.x += PLAYER_VEL
            print("Right: ",player.x + PLAYER_VEL+PLAYER_WIDTH)
    
        draw(player, elapsed_time)




    pygame.quit()


main()
